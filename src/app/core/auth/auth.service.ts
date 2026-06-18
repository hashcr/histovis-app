import { inject, Injectable, signal } from "@angular/core";
import { User } from "../models/user.model";
import { StorageService } from "../services/storage/storage.service";


@Injectable({ providedIn: 'root' })
export class AuthService {
    private storage = inject(StorageService);
    private _user = signal<User | null>(null);

    readonly user = this._user.asReadonly();

    constructor() {
        const stored = this.storage.getSync<User>('user');
        if (stored) this._user.set(stored);
    }

    login(user: User) {
        this._user.set(user);
        this.storage.set('user', user);
    }

    logout() {
        this._user.set(null);
        this.storage.remove('user');
    }

    get token() {
        return this._user()?.token ?? '';
    }

    isLoggedIn(): boolean {
        const user = this._user();
        if (!user) return false;
        if (this.isTokenExpired(user.token)) {
            this.logout();
            return false;
        }
        return true;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            // Non-JWT token — can't determine expiry locally, let the server reject it via 401
            return false;
        }
    }
}