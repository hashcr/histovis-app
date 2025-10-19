import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface ImageForm {
    id: FormControl<string>;
    fileName: FormControl<string>;
    url: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    tagsList: FormArray<FormControl<string>>;
    imageFile: FormControl<File | null>;
}

export type ImageFormValue = FormGroup<ImageForm>;
