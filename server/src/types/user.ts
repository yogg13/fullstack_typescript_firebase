export interface UserRegisterInput {
	email: string;
	password: string;
	username?: string;
}

export interface UserLoginInput {
	email: string;
	password: string;
}

export interface UserData {
	id?: number;
	firebase_uid?: string;
	email: string;
	username?: string; 
	photo_url?: string;
	email_verified_at?: Date;
	status?: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	data?: {
		user?: UserData;
		token?: string;
		refreshToken?: string;
	};
	error?: string;
}
