import express from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import { orders, products } from "../mockData";
import { createYoga, createSchema } from "graphql-yoga";

const app = express();

// Flexible CORS: allow localhost/127.0.0.1 on common dev ports and Docker host "app"
const allowedFromEnv = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const defaultAllowed = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:4000", // in case the frontend is also served on 4000 in some setups
  "http://127.0.0.1:4000",
  "http://app:3000",
];

const allowedOrigins = new Set([...defaultAllowed, ...allowedFromEnv]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);

      // Accept localhost/127.0.0.1 on any port 3000-3999 by pattern, plus explicit list above
      const isLocalPort = /^(http:\/\/(localhost|127\.0\.0\.1):3\d{3})$/.test(origin);
      if (isLocalPort || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  }),
);
app.use(express.json());

/* Provide static images from frontend public dir when needed */
app.use("/images", express.static("/usr/src/api/images"));

/* REST endpoints
   Note: Route paths must be relative (no absolute URL). The frontend should call
   `${NEXT_PUBLIC_API_URL}/rest/...`, but the Express server must register just `/rest/...`.
*/
app.get(`/rest/orders`, (req, res) => {
  const q = String((req.query as any)?.q || "").trim().toLowerCase();
  if (!q) return res.json(orders);
  const contains = (v?: any) => typeof v === "string" && v.toLowerCase().includes(q);
  const matches = orders.filter((o) => {
    const inOrder =
      contains((o as any).title) ||
      contains((o as any).description) ||
      String((o as any).id || "").toLowerCase().includes(q) ||
      contains((o as any).date);
    const prods: any[] = Array.isArray((o as any).products) ? (o as any).products : [];
    const inProducts = prods.some(
      (p: any) => contains(p?.title) || contains(p?.type) || contains(p?.serialNumber) || contains(p?.specification),
    );
    return inOrder || inProducts;
  });
  return res.json(matches);
});

app.get(`/rest/products`, (req, res) => {
  const q = String((req.query as any)?.q || "").trim().toLowerCase();
  if (!q) return res.json(products);
  const contains = (v?: any) => typeof v === "string" && v.toLowerCase().includes(q);
  const matches = products.filter((p: any) =>
    contains(p.title) ||
    contains(p.type) ||
    contains(p.serialNumber) ||
    contains(p.specification) ||
    // Also search price currency symbols, if present
    (Array.isArray(p.price) ? p.price.some((pr: any) => contains(pr?.symbol)) : false)
  );
  return res.json(matches);
});

// Create order
app.post(`/rest/orders`, (req, res) => {
  const body = req.body || {};
  // generate new id
  const nextId = orders.length ? Math.max(...orders.map((o) => o.id || 0)) + 1 : 1;
  const newOrder = {
    id: nextId,
    title: body.title ?? `Order ${nextId}`,
    date: body.date ?? new Date().toISOString(),
    description: body.description ?? undefined,
    photo: body.photo ?? "/images/placeholder.png",
    products: Array.isArray(body.products) ? body.products : [],
  };
  orders.push(newOrder);
  io?.emit("ordersUpdated", { orders });
  return res.status(201).json(newOrder);
});

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

// Add product to order
app.post(`/rest/orders/:id/products`, (req, res) => {
  const orderId = Number(req.params.id);
  const { productId } = req.body || {};

  if (typeof productId !== "number") {
    return res.status(400).json({ ok: false, error: "productId must be provided" });
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ ok: false, error: "Order not found" });

  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ ok: false, error: "Product not found" });

  // assign product to this order
  (product as any).order = orderId;

  // ensure order.products exists and includes the product reference
  if (!Array.isArray((order as any).products)) {
    (order as any).products = [];
  }
  // Allow repeats: push the product even if it's already present in the order
  (order as any).products.push(product);

  io?.emit("ordersUpdated", { orders });
  io?.emit("productsUpdated", { products });

  return res.json(order);
});

// Create product
app.post(`/rest/products`, (req, res) => {
  const body = req.body || {};
  const nextId = products.length ? Math.max(...products.map((p) => p.id || 0)) + 1 : 1;
  const newProduct = {
    id: nextId,
    title: body.title ?? `Product ${nextId}`,
    type: body.type ?? "Unknown",
    serialNumber: body.serialNumber ?? undefined,
    specification: body.specification ?? undefined,
    guarantee: body.guarantee ?? undefined,
    price: Array.isArray(body.price) ? body.price : undefined,
    order: typeof body.order === "number" ? body.order : undefined,
    date: body.date ?? new Date().toISOString(),
    photo: body.photo ?? "/images/placeholder.png",
    isNew: typeof body.isNew === "number" ? body.isNew : 1,
  };
  products.push(newProduct);
  io?.emit("productsUpdated", { products });
  return res.status(201).json(newProduct);
});

// Delete product
app.delete(`/rest/products/:id`, (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex((p) => p.id === id);
  if (idx >= 0) {
    products.splice(idx, 1);
    io?.emit("productsUpdated", { products });
    return res.json({ ok: true });
  }
  return res.status(404).json({ ok: false });
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
      photo: String
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
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocalPort = /^(http:\/\/(localhost|127\.0\.0\.1):3\d{3})$/.test(origin);
      if (isLocalPort || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS (socket): Origin not allowed: ${origin}`));
    },
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
