import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LoginRequest, LoginResponse } from "./login.service.types";
import { Observable, tap } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";
import { AuthService } from "src/app/core/auth/auth.service";

@Injectable({providedIn: 'root'})
export class LoginService {
    private api = inject(ApiService).for(environment.authApiBaseUrl);
    private auth = inject(AuthService);

    login(payload: LoginRequest): Observable<LoginResponse> {
        return this.api.post<LoginResponse, LoginRequest>('login', payload)
            .pipe(
                tap((response: LoginResponse) => this.auth.login(response.user))
            );
    }
}