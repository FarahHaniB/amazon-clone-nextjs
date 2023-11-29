// import { buffer } from "micro";
// import * as admin from "firebase-admin";

// // Secure a connection to FIREBASE from the backend
// const serviceAccount = require("../../../permissions.json");

// const app = !admin.apps.length
//   ? admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     })
//   : admin.app();

// // Establish connection to Stripe
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// const fulfillOrder = async (session) => {
//   console.log("Fulfilling order", session);

//   return app
//     .firestore()
//     .collection("users")
//     .doc(session.metadata.email)
//     .collection("orders")
//     .doc(session.id)
//     .set({
//       amount: session.amount_total / 100,
//       amount_shipping: session.total_details.amount_shipping / 100,
//       images: JSON.parse(session.metadata.images),
//       timestamp: admin.firestore.FieldValue.serverTimestamp(),
//     })
//     .then(() => {
//       console.log(`SUCCESS: Order ${session.id} had been added to the DB`);
//     });
// };

// export default async (req, res) => {
//   if (req.method === "POST") {
//     const requestBuffer = await buffer(req);
//     const payload = requestBuffer.toString();
//     const sig = req.headers["stripe-signature"];

//     // let event;

//     // event = stripe.webhooks.constructEvent(
//     //   req.body,
//     //   sig,
//     //   endpointSecret
//     // );

//     let event;

//     // Verify that the EVENT posted came from stripe
//     try {
//       event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
//     } catch (err) {
//       console.log(`ERROR`, err.message);
//       return res.status(400).send(`Webhook error: ${err.message}`);
//     }

//     // Handle the checkout.session.completed event
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       console.log(event.data.object);
//       console.log(event.type);

//       // Fulfill the order
//       return fulfillOrder(session)
//         .then(() => res.status(200))
//         .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
//     }
//   }
// };

// export const config = {
//   api: {
//     bodyParser: false,
//     externalResolver: true,
//   },
// };

import { buffer } from "micro";
import * as admin from "firebase-admin";

// Secure a connection to FIREBASE from the backend
const serviceAccount = require("../../../permissions.json");

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

// Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  console.log("Fulfilling order", session);

  try {
    await app
      .firestore()
      .collection("users")
      .doc(session.metadata.email)
      .collection("orders")
      .doc(session.id)
      .set({
        amount: session.amount_total / 100,
        amount_shipping: session.total_details.amount_shipping / 100,
        images: JSON.parse(session.metadata.images),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    console.log(`SUCCESS: Order ${session.id} had been added to the DB`);
    return true;
  } catch (error) {
    console.log("Error adding order to Firestore:", error);
    return false;
  }
};

export default async (req, res) => {
  console.log("Incoming request method:", req.method); // Logging incoming request method
  console.log("Webhook received:", req.method);
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    // let event;

    // event = stripe.webhooks.constructEvent(
    //   req.body,
    //   sig,
    //   endpointSecret
    // );

    let event;

    // Verify that the EVENT posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(`ERROR`, err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkout session completed:", session);
      console.log(event.data.object);
      console.log(event.type);

      // Fulfill the order
      const orderFulfilled = await fulfillOrder(session);
      if (orderFulfilled) {
        res.status(200).end();
      } else {
        res.status(400).end();
      }
    } else {
      res.status(400).send(`Unexpected event type: ${event.type}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
  res.status(200).end();
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
