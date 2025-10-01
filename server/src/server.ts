import Fastify from "fastify";
import dotenv from "dotenv";
import { testDatabaseConnection } from "./config/database";
import { testFirebaseConnection } from "./config/firebase";

import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes"; // Add this import

import { createSimpleLogger } from "./utils/logger";
import cors from "@fastify/cors";

// Load environment variables
dotenv.config();

// Create simple logger for fallback
const simpleLogger = createSimpleLogger();

// Inisialisasi Fastify server dengan logger yang robust
const fastify = Fastify({
  logger: {
    level: "info",
  },
});

// Register CORS plugin
fastify.register(cors, {
  origin: "http://localhost:5173", // Allow all origins for simplicity; adjust as needed for production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "[Authorization, application/json]"],
});

// Register routes
fastify.register(productRoutes, { prefix: "/api" });
fastify.register(authRoutes, { prefix: "/api/auth" }); // Add this line


// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  // Validation error
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      message: "Validation error",
      errors: error.validation,
    });
  }

  // Generic error
  return reply.status(500).send({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);

  try {
    await fastify.close();
    fastify.log.info("Server closed successfully");
    process.exit(0);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    fastify.log.error("Error during shutdown: " + errorMessage);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
const start = async () => {
  try {
    simpleLogger.info("🚀 Starting Fastify MySQL Firebase Tutorial Server...");

    // Test database connection
    simpleLogger.info("📊 Testing database connection...");
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      throw new Error("Database connection failed");
    }
    simpleLogger.success("✅ Database connected successfully");

    // Test Firebase connection
    simpleLogger.info("🔥 Testing Firebase connection...");
    const firebaseConnected = await testFirebaseConnection();
    if (!firebaseConnected) {
      simpleLogger.warn(
        "⚠️  Firebase connection failed, but server will continue to run"
      );
    } else {
      simpleLogger.success("✅ Firebase connected successfully");
    }

    // Start server
    const port = parseInt(process.env.PORT || "3000");
    await fastify.listen({ port, host: "0.0.0.0" });

    simpleLogger.success(`🚀 Server running at http://localhost:${port}`);
    simpleLogger.info(`🛍️ Products API: http://localhost:${port}/api/products`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    simpleLogger.error("Failed to start server: " + errorMessage);
    process.exit(1);
  }
};

start();
