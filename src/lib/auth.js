import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

if (!process.env.DB_URL) {
  throw new Error("DB_URL is missing");
}

// Reuse one MongoClient for the whole server process. globalThis is shared by
// every bundle (proxy, route handlers, pages) and survives hot reloads, so we
// do not open a new connection pool each time this file is evaluated.
const globalForMongo = globalThis;

const client =
  globalForMongo.impacthubMongoClient ??
  (globalForMongo.impacthubMongoClient = new MongoClient(process.env.DB_URL));

const db = client.db("impacthub");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  ...(process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),

  // Why this hook exists (MongoTopologyClosedError):
  // The MongoDB driver connects lazily on the first query. If that first
  // connection attempt fails (network blip, cold start, database not reachable
  // yet) the driver closes its topology but keeps it on the client. Better
  // Auth only runs queries and never calls connect(), so every later request
  // on the same server instance keeps failing with "Topology is closed".
  // client.connect() is the documented way to (re)connect: it returns right
  // away when the client is already connected, and opens a fresh connection
  // when the previous attempt failed.
  hooks: {
    before: createAuthMiddleware(async () => {
      try {
        await client.connect();
      } catch (error) {
        // Log the real cause. The request itself then fails with its own error.
        console.error("MongoDB connection failed:", error);
      }
    }),
  },

  plugins: [
    jwt({
      sessionCookieCache: true,
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
