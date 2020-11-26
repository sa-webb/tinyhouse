import stripe from "stripe";

const secret = process.env.S_SECRET_KEY;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client = new stripe(secret!, { apiVersion: "2020-08-27" });

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    try {
      const res = await client.charges.create(
        {
          amount,
          currency: "usd",
          source,
          application_fee_amount: Math.round(amount * 0.05),
        },
        {
          stripeAccount: stripeAccount,
        }
      );

      if (res.status !== "succeeded") {
        throw new Error("failed to create charge with Stripe");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
