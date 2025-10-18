import { inject } from "@angular/core"
import { AuthService } from "./auth.service";
import { HttpInterceptorFn } from "@angular/common/http";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const auth  = inject(AuthService);
    const token = auth.token;
    const cloned = token ?  req.clone({setHeaders: {Authorization: `Bearer ${token}`}}) : req;
    return next(cloned);
}