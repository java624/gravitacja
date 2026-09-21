export class CreateCheckoutSessionDto {
  resourceId!: string;
  resourceName?: string;
  locationSlug!: string;
  clientName!: string;
  clientPhone!: string;
  clientEmail!: string;
  date!: string;
  startTime!: string;
  endTime!: string;
  guestsCount!: number;
  totalPrice!: number;
  includeShoes?: boolean;
  paymentMethod?: string;
  successUrl?: string;
  cancelUrl?: string;
}
