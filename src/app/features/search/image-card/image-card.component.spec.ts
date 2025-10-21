import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageCardComponent } from './image-card.component';
import { Component, Input } from '@angular/core';
import { ImageInfo } from 'src/app/core/models/image.model';
import { provideRouter } from '@angular/router';

describe('ImageCardComponent', () => {
  let fixture: ComponentFixture<any>;
  let hostComponent: TestHostComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
      ]
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
  template: ` <app-image-card [image]="image"></app-image-card>`,
  imports: [ImageCardComponent],
})
class TestHostComponent {
  @Input() image!: ImageInfo;
}
