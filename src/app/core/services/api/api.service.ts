import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from 'rxjs';

export class ScopedApiService {
    constructor(private http: HttpClient, private base: string) {}

    /** Send POST request. 
     * @template T - response type
     * @template B - body type (defaults to unknown)
     */
    public post<T, B = unknown>(path: string, body: B): Observable<T> {
        return this.http.post<T>(path ? `${this.base}/${path}` : this.base, body);
    }

    /** Send GET request.
     * @template T - response type
     * @template P - params type (defaults to unknown)
     */
    public get<T, P = unknown>(path: string, params?: P): Observable<T> {
        let httpParams = new HttpParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    httpParams = httpParams.set(key, String(value));
                }
            });
        }

        return this.http.get<T>(path ? `${this.base}/${path}` : this.base, { params: httpParams });
    }

    /** Send PUT request. 
     * @template T - response type
     * @template B - body type (defaults to unknown)
     */
    public put<T, B = unknown>(path: string, body: B): Observable<T> {
        return this.http.put<T>(path ? `${this.base}/${path}` : this.base, body);
    }

    /** Send DELETE request. 
     * @template T - response type
     * @template P - params type (defaults to unknown)
     */
    public delete<T>(path: string): Observable<T> {
        return this.http.delete<T>(path ? `${this.base}/${path}` : this.base);
    }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);

    for(baseUrl: string): ScopedApiService {
        return new ScopedApiService(this.http, baseUrl);
    }
}
