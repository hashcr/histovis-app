import { inject, Injectable } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user.model';

@Injectable({
	providedIn: 'root'
})
export class LoginFormService {
	private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

	/**
	 * Create and return the login form group.
	 * Controls: email, password
	 */
	createForm(): FormGroup {
		return this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}
}

