import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class StorageService {
    async set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    async get<T>(key: string): Promise<T | null> {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }

    getSync<T>(key: string): T | null {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }

    async remove(key: string) {
        localStorage.removeItem(key);
    }
}