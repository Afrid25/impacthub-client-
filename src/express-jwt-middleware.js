/**
 * Express JWT authentication middleware for ImpactHub backend.
 *
 * Verifies Bearer JWTs issued by Better Auth (JWT plugin) using the
 * server's JWKS endpoint. Cryptographically verifies the signature,
 * checks issuer, audience, and expiration. Sets req.user with the
 * verified subject (user ID) as the identity.
 *
 * Prerequisites (install in the Express backend):
 *   npm install jose
 *
 * Usage:
 *   const { authenticateJWT, requireOwnership } = require("./auth-middleware");
 *   app.post("/joined", authenticateJWT, joinEventHandler);
 *   app.patch("/update-events/:id", authenticateJWT, requireOwnership("userId"), editEventHandler);
 *   app.delete("/created-events/:id", authenticateJWT, requireOwnership("userId"), deleteEventHandler);
 */

import { createRemoteJWKSet, jwtVerify } from "jose";

// Better Auth base URL (must match BETTER_AUTH_URL in the client)
const BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const JWKS_URL = `${BASE_URL.replace(/\/$/, "")}/api/auth/jwks`;

const jwks = createRemoteJWKSet(new URL(JWKS_URL));

/**
 * Verify a Better Auth JWT and attach req.user (identity from `sub` claim).
 */
export async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: BASE_URL.replace(/\/$/, ""),
      audience: BASE_URL.replace(/\/$/, ""),
      clockTolerance: 30, // allow 30s clock skew
    });

    // `sub` is the Better Auth user ID (subject of the JWT)
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.image,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    if (error.name === "JWTInvalid" || error.code === "ERR_JWS_INVALID") {
      return res.status(401).json({ message: "Invalid token." });
    }
    return res.status(401).json({ message: "Authentication failed." });
  }
}

/**
 * Middleware factory: verifies that the authenticated user owns the resource.
 * `idField` is the name of the field in req.body / req.params that contains
 * the owner user ID to compare against req.user.id.
 */
export function requireOwnership(idField = "userId") {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const ownerId = req.body?.[idField] ?? req.params?.[idField];

    if (!ownerId) {
      return res.status(400).json({ message: `Missing ${idField} in request.` });
    }

    if (String(ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden: you do not own this resource." });
    }

    next();
  };
}
