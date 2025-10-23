import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private base = environment.authApiBaseUrl;

    /** Send POST request. 
     * @template T - response type
     * @template B - body type (defaults to unknown)
     */
    public post<T, B = unknown>(path: string, body: B): Observable<T> {
        return this.http.post<T>(`${this.base}/${path}`, body);
    }

    /** Send GET request.
     * @template T - response type
     */
    public get<T>(path: string): Observable<T> {
        return this.http.get<T>(`${this.base}/${path}`);
    }

    /** Send PUT request. 
     * @template T - response type
     * @template B - body type (defaults to unknown)
     */
    public put<T, B = unknown>(path: string, body: B): Observable<T> {
        return this.http.put<T>(`${this.base}/${path}`, body);
    }
}