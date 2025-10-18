import { Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/features/login/model';
import { LoginFormValue } from './login.form.types';
import { LoginRequest } from './login.service.types';

@Injectable({
	providedIn: 'root'
})
export class LoginFormValueService {
    
    toModel(form: LoginFormValue): LoginRequest {
        const v = form.getRawValue();
        return {
            email: v.email,
            password: v.password,
        };
    }
}
