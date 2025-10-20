import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Input, signal, WritableSignal } from '@angular/core';

import { ImageFormComponent } from './image-form.component';
import { ImageInfo } from '../../../core/models/image.model';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

const mockImage: ImageInfo = {
  id: '1',
  fileName: 'test.jpg',
  url: '',
  title: 'Test',
  description: 'desc',
  tagsList: [],
  imageFile: null,
} as ImageInfo;

describe('ImageFormComponent', () => {

  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;

    hostFixture.detectChanges();
  }));

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });
});

@Component({
  standalone: true,
  template: `
      <app-image-form
        [imageData]="imageData"
        [resetTrigger]="resetTriggerFactory"
        (save)="onSave($event)">
      </app-image-form>
    `,
  imports: [ImageFormComponent],
})
class TestHostComponent {
  @Input() imageData= mockImage;
  // The component expects resetTrigger to be a function returning a WritableSignal<boolean>
  resetTriggerFactory!: () => WritableSignal<boolean>;
  savedValue: any = undefined;

  onSave(value: any) {
    this.savedValue = value;
  }
}