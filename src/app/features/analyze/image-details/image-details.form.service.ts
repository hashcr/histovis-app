import { inject, Injectable } from '@angular/core';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class ImageDetailsFormService {
	private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

	createNotesFormControl(): FormControl<string> {
		return this.fb.control('');
	}

    createCommentsFormControl(): FormControl<string> {
        return this.fb.control('');
    }
}

