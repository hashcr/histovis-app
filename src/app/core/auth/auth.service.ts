import { inject, Injectable, signal } from "@angular/core";
import { User } from "../../features/login/model";
import { StorageService } from "../services/storage/storage.service";


@Injectable({providedIn: 'root'})
export class AuthService {
    private storage= inject(StorageService);
    private _user = signal<User | null>(null);

    readonly user = this._user.asReadonly();

    async init() {
        const stored = await this.storage.get<User>('user');
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

    isLoggedIn() {
        return !!this._user();
    }
}