import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagsSelectorComponent } from './tags-selector.component';
import { ImageFormFormService } from '../../../upload/image-form/image-form.form.service';
import { FormArray, FormControl } from '@angular/forms';
import { Component, Input } from '@angular/core';

describe('TagsSelectorComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let imageFormServiceMock: jasmine.SpyObj<ImageFormFormService>;

  beforeEach(waitForAsync(() => {
    imageFormServiceMock = jasmine.createSpyObj('ImageFormFormService', ['getTags', 'addTag', 'removeTag']);
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: ImageFormFormService, useValue: imageFormServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.tags = new FormArray<FormControl<string>>([]);

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  standalone: true,
  template: ` <app-tags-selector [tagsArray]="tags"></app-tags-selector>`,
  imports: [TagsSelectorComponent],
})
class TestHostComponent {
  @Input() tags!: FormArray<FormControl<string>>;
}