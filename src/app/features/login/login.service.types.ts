// Types for login API requests and responses

import { User } from "src/app/core/models/user.model";

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
    user: User;
}
