import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageSearchPage } from './image-search.page';
import { ImageService } from '../../upload/services/image.service';

describe('ImageSearchPage', () => {
  let component: ImageSearchPage;
  let fixture: ComponentFixture<ImageSearchPage>;
  let imageSearchMock: jasmine.SpyObj<ImageService>;

  beforeEach(() => {
    imageSearchMock = jasmine.createSpyObj('ImageService', ['getAllImages']);
    TestBed.configureTestingModule({
      imports: [ImageSearchPage],
      providers: [
        { provide: ImageService, useValue: imageSearchMock }
      ]
    });
    fixture = TestBed.createComponent(ImageSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
