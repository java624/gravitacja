import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY || '';

    if (!secretKey) {
      this.logger.error('STRIPE_SECRET_KEY is not defined! Payment endpoints will return errors.');
      // Initialize with dummy key - will fail on actual API calls with clear error
      this.stripe = new Stripe('sk_test_missing_configure_env', {
        apiVersion: '2025-02-24.acacia' as any,
      });
    } else {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-02-24.acacia' as any,
      });
      this.logger.log('Stripe initialized with STRIPE_SECRET_KEY from environment');
    }
  }

  getConfig() {
    return {
      status: 'active',
      mode: 'test',
      currency: 'PLN',
      supportedMethods: ['card', 'blik', 'p24'],
    };
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDto) {
    if (!dto.totalPrice || dto.totalPrice <= 0) {
      throw new BadRequestException('Kwota rezerwacji musi być większa niż 0');
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // Map requested payment method to valid Stripe payment types
    let paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
      'card',
      'blik',
      'p24',
    ];

    if (dto.paymentMethod === 'card') {
      paymentMethodTypes = ['card'];
    } else if (dto.paymentMethod === 'blik') {
      paymentMethodTypes = ['card', 'blik'];
    } else if (dto.paymentMethod === 'payu') {
      paymentMethodTypes = ['card', 'p24'];
    }

    const resourceLabel = dto.resourceName || 'Tor Bowlingowy / Stół Bilardowy';
    const locationName = dto.locationSlug
      ? dto.locationSlug.charAt(0).toUpperCase() + dto.locationSlug.slice(1)
      : 'Katowice';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: `Rezerwacja Gravitacja ${locationName}: ${resourceLabel}`,
              description: `Termin: ${dto.date} (${dto.startTime} - ${dto.endTime}), Liczba gości: ${dto.guestsCount}${
                dto.includeShoes ? ' (w tym obuwie)' : ''
              }`,
            },
            unit_amount: Math.round(dto.totalPrice * 100), // Stripe takes amounts in grosze (1 PLN = 100)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: dto.clientEmail,
      success_url:
        dto.successUrl ||
        `${clientUrl}/${dto.locationSlug}/rezerwacje?session_id={CHECKOUT_SESSION_ID}&booking_success=true`,
      cancel_url:
        dto.cancelUrl ||
        `${clientUrl}/${dto.locationSlug}/rezerwacje?booking_cancelled=true`,
      metadata: {
        resourceId: dto.resourceId,
        resourceName: dto.resourceName || '',
        locationSlug: dto.locationSlug,
        clientName: dto.clientName,
        clientPhone: dto.clientPhone,
        clientEmail: dto.clientEmail,
        reservationDate: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        guestsCount: String(dto.guestsCount),
        totalPrice: String(dto.totalPrice),
        includeShoes: String(dto.includeShoes ?? false),
        paymentMethod: dto.paymentMethod || 'stripe',
      },
    });

    this.logger.log(`Created Stripe checkout session: ${session.id} for ${dto.clientEmail}`);

    return {
      id: session.id,
      url: session.url,
      totalPrice: dto.totalPrice,
      currency: 'PLN',
    };
  }

  async verifySession(sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('Brak parametru sessionId');
    }

    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return {
        id: session.id,
        paid: session.payment_status === 'paid',
        paymentStatus: session.payment_status,
        status: session.status,
        amountTotal: session.amount_total ? session.amount_total / 100 : null,
        currency: session.currency?.toUpperCase() || 'PLN',
        customerEmail: session.customer_details?.email || session.customer_email,
        metadata: session.metadata,
      };
    } catch (err: any) {
      this.logger.error(`Error retrieving session ${sessionId}:`, err);
      throw new BadRequestException(`Nie można zweryfikować sesji Stripe: ${err.message}`);
    }
  }
}
