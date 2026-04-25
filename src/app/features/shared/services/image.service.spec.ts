import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ImageService } from './image.service';
import { ApiService, ScopedApiService } from 'src/app/core/services/api/api.service';

describe('UploadImageService', () => {
  let service: ImageService;
  let scopedApiSpy: jasmine.SpyObj<ScopedApiService>;

  beforeEach(() => {
    scopedApiSpy = jasmine.createSpyObj<ScopedApiService>('ScopedApiService', ['post', 'get', 'put', 'delete']);
    scopedApiSpy.post.and.returnValue(of({} as any));

    const apiServiceMock = { for: () => scopedApiSpy };

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
      ],
    });
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
