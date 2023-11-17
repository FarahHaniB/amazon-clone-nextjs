const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items, email } = req.body;
  console.log(req.body)

  const transformedItems = items.map((item) => ({
    description: item.description,
    quantity: 1,
    price_data: {
      currency: "myr",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_rates: ["shr_1OD14EIyZ061cYngBeaNmsJt"],
      shipping_address_collection: {
        allowed_countries: ["MY", "JP"],
      },
      line_items: transformedItems,
      mode: "payment",
      success_url: `${process.env.HOST}/success`,
      cancel_url: `${process.env.HOST}/checkout`,
      metadata: {
        email,
        images: JSON.stringify(items.map((item) => item.image)),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe API Error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
