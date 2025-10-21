import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ImageService } from './image.service';
import { ApiService } from 'src/app/core/services/api/api.service';

describe('UploadImageService', () => {
  let service: ImageService;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj<ApiService>('ApiService', ['post']);
    // default stub for post to avoid unexpected nulls
    apiSpy.post.and.returnValue(of({} as any));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiSpy },
      ],
    });
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
