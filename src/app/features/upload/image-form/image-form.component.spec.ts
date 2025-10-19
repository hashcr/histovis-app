import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageFormComponent } from './image-form.component';

describe('ImageFormComponent', () => {
  let component: ImageFormComponent;
  let fixture: ComponentFixture<ImageFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ImageFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
