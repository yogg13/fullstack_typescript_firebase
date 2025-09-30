"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const firebase_1 = require("./config/firebase");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
// Load environment variables
dotenv_1.default.config();
// Inisialisasi Fastify server
const fastify = (0, fastify_1.default)({
    logger: {
        level: "info",
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    },
});
// Register routes
fastify.register(productRoutes_1.default, { prefix: "/api" });
// Health check endpoint
fastify.get("/health", async (request, reply) => {
    return {
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Fastify MySQL Firebase Tutorial",
    };
});
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
        error: process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
    });
});
// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
    fastify.log.info(`Received ${signal}, shutting down gracefully...`);
    try {
        await fastify.close();
        fastify.log.info("Server closed successfully");
        process.exit(0);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
        // Test database connection
        const dbConnected = await (0, database_1.testDatabaseConnection)();
        if (!dbConnected) {
            throw new Error("Database connection failed");
        }
        // Test Firebase connection
        const firebaseConnected = await (0, firebase_1.testFirebaseConnection)();
        if (!firebaseConnected) {
            fastify.log.warn("Firebase connection failed, but server will continue to run");
        }
        // Start server
        const port = parseInt(process.env.PORT || "3000");
        await fastify.listen({ port, host: "0.0.0.0" });
        fastify.log.info(`🚀 Server running at http://localhost:${port}`);
        fastify.log.info(`📊 Health check: http://localhost:${port}/health`);
        fastify.log.info(`🛍️ Products API: http://localhost:${port}/api/products`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        fastify.log.error("Failed to start server: " + errorMessage);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map