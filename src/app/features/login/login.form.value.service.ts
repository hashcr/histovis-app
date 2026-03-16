import { Injectable } from '@angular/core';
import { LoginFormValue } from './login.form.types';
import { LoginRequest } from './login.service.types';

@Injectable({
	providedIn: 'root'
})
export class LoginFormValueService {
    
    toModel(form: LoginFormValue): LoginRequest {
        const v = form.getRawValue();
        return {
            username: v.username,
            password: v.password,
        };
    }
}
