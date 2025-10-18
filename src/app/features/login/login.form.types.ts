import { FormControl, FormGroup } from "@angular/forms";

export interface LoginForm {
	email: FormControl<string>;
	password: FormControl<string>;
}

export type LoginFormValue = FormGroup<LoginForm>;

