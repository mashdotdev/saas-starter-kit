import {
  lemonSqueezySetup,
  createCheckout,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";

function setup() {
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });
}

interface CheckoutOptions {
  userId: string;
  orgId: string;
  userEmail: string;
}

export async function createCheckoutUrl(opts: CheckoutOptions): Promise<string> {
  setup();

  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;
  const variantId = process.env.LEMONSQUEEZY_PRO_VARIANT_ID!;

  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: opts.userEmail,
      custom: {
        user_id: opts.userId,
        org_id: opts.orgId,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    },
  });

  if (error || !data?.data.attributes.url) {
    throw new Error(error?.message ?? "Failed to create checkout");
  }

  return data.data.attributes.url;
}

export async function createPortalUrl(lemonSqueezyId: string): Promise<string> {
  setup();

  const { data, error } = await getCustomer(lemonSqueezyId);

  if (error || !data?.data.attributes.urls?.customer_portal) {
    throw new Error(error?.message ?? "Failed to get portal URL");
  }

  return data.data.attributes.urls.customer_portal;
}
