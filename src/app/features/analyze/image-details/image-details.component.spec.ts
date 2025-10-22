import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ImageDetailsComponent } from './image-details.component';
import { ImageInfo } from 'src/app/core/models/image.model';

describe('ImageDetailsComponent', () => {
  let fixture: ComponentFixture<any>;
  let hostComponent: TestHostComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    const dummyImage: ImageInfo = {
      id: '1',
      fileName: 'example.jpg',
      url: 'http://example.com/image.jpg',
      title: 'Example Image',
      description: 'This is an example image.',
      tagsList: ['example', 'image'],
      imageFile: null,
    };
    hostComponent.image = dummyImage;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });
});

@Component({
  standalone: true,
  template: ` <app-image-comments [imageInfo]="image"></app-image-comments>`,
  imports: [ImageDetailsComponent],
})
class TestHostComponent {
  image!: ImageInfo;
}
