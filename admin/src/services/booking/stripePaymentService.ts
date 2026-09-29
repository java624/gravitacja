export interface StripeCheckoutRequest {
  resourceId: string;
  resourceName?: string;
  locationSlug: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  totalPrice: number;
  includeShoes?: boolean;
  paymentMethod?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeCheckoutResponse {
  id: string;
  url: string;
  totalPrice: number;
  currency: string;
}

export interface StripeVerificationResponse {
  id: string;
  paid: boolean;
  paymentStatus: string;
  status: string;
  amountTotal: number | null;
  currency: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function createStripeCheckoutSession(
  data: StripeCheckoutRequest
): Promise<StripeCheckoutResponse> {
  const url = `${API_BASE}/api/payments/create-checkout-session`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Błąd inicjalizacji płatności Stripe (${response.status})`
    );
  }

  return response.json();
}

export async function verifyStripeSession(
  sessionId: string
): Promise<StripeVerificationResponse> {
  const url = `${API_BASE}/api/payments/verify-session?sessionId=${encodeURIComponent(
    sessionId
  )}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Błąd weryfikacji płatności Stripe (${response.status})`
    );
  }

  return response.json();
}

export async function getStripePaymentConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/payments/config`);
    if (res.ok) return await res.json();
  } catch {
    // fallback if server is starting
  }
  return { mode: 'test', currency: 'PLN' };
}
