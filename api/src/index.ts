import express from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import { orders, products } from "../mockData";
import { createYoga, createSchema } from "graphql-yoga";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://app:3000"],
    credentials: true,
  }),
);
app.use(express.json());

/* Provide static images from frontend public dir when needed */
app.use("/images", express.static("/usr/src/api/images"));

/* REST endpoints
   Note: Route paths must be relative (no absolute URL). The frontend should call
   `${NEXT_PUBLIC_API_URL}/rest/...`, but the Express server must register just `/rest/...`.
*/
app.get(`/rest/orders`, (req, res) => res.json(orders));

app.get(`/rest/products`, (req, res) => res.json(products));

app.delete(`/rest/orders/:id`, (req, res) => {
  const id = Number(req.params.id);
  const idx = orders.findIndex((o) => o.id === id);

  if (idx >= 0) {
    orders.splice(idx, 1);
    io?.emit("ordersUpdated", { orders });
    return res.json({ ok: true });
  }

  res.status(404).json({ ok: false });
});

/* GraphQL Schema */
const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Price {
      value: Float
      symbol: String
      isDefault: Int
    }
    type Guarantee {
      start: String
      end: String
    }
    type Product {
      id: Int
      title: String
      type: String
      serialNumber: Int
      specification: String
      price: [Price]
      order: Int
      date: String
      guarantee: Guarantee
      photo: String
      isNew: Int
    }

    type Order {
      id: Int
      title: String
      date: String
      description: String
      products: [Product]
    }

    type Query {
      orders: [Order]
      products: [Product]
      productsByType(type: String): [Product]
      hello: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello from Yoga!",
      orders: () =>
        orders.map((o) => ({
          ...o,
          products: products.filter((p) => p.order === o.id),
        })),
      products: () => products,
      productsByType: (_: any, { type }: any) =>
        products.filter((p) => p.type === type),
    },
  },
});

/* Create Yoga GraphQL server */
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql", // same as Apollo’s path
});

/* Create the HTTP server and bind Express + Yoga */
const httpServer = http.createServer(app);

/* Attach Yoga to Express via handler */
app.use(yoga.graphqlEndpoint, yoga);

/* Socket.io setup */
const io = new IOServer(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://app:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let sessions = 0;
io.on("connection", (socket) => {
  sessions++;
  io.emit("sessions", { sessions });

  socket.on("disconnect", () => {
    sessions--;
    io.emit("sessions", { sessions });
  });
});

/* Start server */
const port = 4000;

httpServer.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
});
