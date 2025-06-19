import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

router.post("/activos", async (req, res) => {
  const { item, cartExtra } = await req.body;

  //INICIALIZACION STRUIPE
  const stripe = new Stripe(stripeSecretKey);

  //MAPEO PARA OBTENER ITEMS
  const mapCartExtra = await cartExtra.map((s) => {
    return {
      quantity: s.quantity,
      price: s.price,
    };
  });
  const mapItems = await item.map((s) => {
    return {
      name: s.name,
      description: s.description,
      images: s.images,
      discountedPrice: s.discountedPrice,
    };
  });

  //ITEMS
  const extractingItems = mapItems.map((item, index) => ({
    quantity: mapCartExtra[index]?.quantity || 1,
    price_data: {
      currency: "usd",
      unit_amount: Math.round((item.discountedPrice / 4347.448) * 100),
      product_data: {
        name: item.name,
        description: item.description,
        images: item.images,
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: extractingItems,
    mode: "payment",
    success_url:
      "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:5173/cancel",
  });

  res.json({
    message: "Server is connected",
    success: true,
    id: session.id,
  });
});

export default router;
