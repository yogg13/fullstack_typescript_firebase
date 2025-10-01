import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/authService";
import { UserRegisterInput, UserLoginInput, UserData } from "../types/user";
import {authenticate} from "../middleware/authMiddleware";


// Define schemas for request validation
const userRegisterSchema = {
	type: "object",
	required: ["email", "password"],
	properties: {
		email: { type: "string", format: "email" },
		password: { type: "string", minLength: 6 },
		displayName: { type: "string" },
	},
};

const userLoginSchema = {
	type: "object",
	required: ["email", "password"],
	properties: {
		email: { type: "string", format: "email" },
		password: { type: "string" },
	},
};

// Add profile update schema
const userUpdateSchema = {
	type: "object",
	properties: {
		display_name: { type: "string" },
		photo_url: { type: "string" },
		status: { type: "string", enum: ["active", "inactive", "banned"] },
	},
};

export default async function authRoutes(fastify: FastifyInstance) {
	const authService = new AuthService();

	// Register a new user
	fastify.post<{ Body: UserRegisterInput }>(
		"/register",
		{
			schema: {
				body: userRegisterSchema,
				response: {
					201: {
						type: "object",
						properties: {
							success: { type: "boolean" },
							message: { type: "string" },
							data: {
								type: "object",
								properties: {
									user: { type: "object" },
									token: { type: "string" },
								},
							},
						},
					},
				},
			},
		},
		async (request, reply) => {
			const result = await authService.registerUser(request.body);

			if (!result.success) {
				return reply.code(400).send(result);
			}

			return reply.code(201).send(result);
		}
	);

	// Login user
	fastify.post<{ Body: UserLoginInput }>(
		"/login",
		{
			schema: {
				body: userLoginSchema,
				response: {
					200: {
						type: "object",
						properties: {
							success: { type: "boolean" },
							message: { type: "string" },
							data: {
								type: "object",
								properties: {
									user: { type: "object" },
									token: { type: "string" },
								},
							},
						},
					},
				},
			},
		},
		async (request, reply) => {
			const result = await authService.loginUser(request.body);

			if (!result.success) {
				return reply.code(401).send(result);
			}

			return reply.send(result);
		}
	);

	// Me endpoint (get current user)
	fastify.get(
		"/profile/me",
		{
			preValidation: (request, reply, done) => {
				// Get token from headers
				const authHeader = request.headers.authorization;
				const token = authHeader?.split(" ")[1];

				if (!token) {
					return reply.code(401).send({
						success: false,
						message: "Authentication required",
						error: "No token provided",
					});
				}

				// Add token to request
				request.token = token;
				done();
			},
		},
		async (request: FastifyRequest & { token?: string }, reply) => {
			const result = await authService.verifyToken(request.token || "");

			if (!result.success) {
				return reply.code(401).send(result);
			}

			return reply.send(result);
		}
	);

	// Get user by ID
	fastify.get<{ Params: { id: string } }>(
		"/users/:id",
		{
			preHandler: authenticate,
			schema: {
				params: {
					type: "object",
					properties: {
						id: { type: "string" },
					},
				},
			},
		},
		async (request, reply) => {
			const userId = parseInt(request.params.id);

			if (isNaN(userId)) {
				return reply.code(400).send({
					success: false,
					message: "Invalid user ID",
					error: "User ID must be a number",
				});
			}

			const user = await authService.getUserById(userId);

			if (!user) {
				return reply.code(404).send({
					success: false,
					message: "User not found",
					error: "User with the specified ID does not exist",
				});
			}

			return reply.send({
				success: true,
				message: "User retrieved successfully",
				data: { user },
			});
		}
	);

	// Update user profile
	fastify.put<{ Params: { id: string }; Body: Partial<UserData> }>(
		"/users/:id",
		{
			preHandler: authenticate,
			schema: {
				body: userUpdateSchema,
				params: {
					type: "object",
					properties: {
						id: { type: "string" },
					},
				},
			},
		},
		async (request, reply) => {
			const userId = parseInt(request.params.id);

			if (isNaN(userId)) {
				return reply.code(400).send({
					success: false,
					message: "Invalid user ID",
					error: "User ID must be a number",
				});
			}

			const result = await authService.updateUserProfile(userId, request.body);

			if (!result.success) {
				return reply.code(400).send(result);
			}

			return reply.send(result);
		}
	);

	// Delete user
	fastify.delete<{ Params: { id: string } }>(
		"/users/:id",
		{
			preHandler: authenticate,
			schema: {
				params: {
					type: "object",
					properties: {
						id: { type: "string" },
					},
				},
			},
		},
		async (request, reply) => {
			const userId = parseInt(request.params.id);

			if (isNaN(userId)) {
				return reply.code(400).send({
					success: false,
					message: "Invalid user ID",
					error: "User ID must be a number",
				});
			}

			const result = await authService.deleteUser(userId);

			if (!result.success) {
				return reply.code(400).send(result);
			}

			return reply.send(result);
		}
	);
}
