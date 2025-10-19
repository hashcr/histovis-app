// Types for login API requests and responses

import { User } from "src/app/core/models/user.model";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
    user: User;
}
