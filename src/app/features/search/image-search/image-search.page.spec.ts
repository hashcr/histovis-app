import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

import { ImageSearchPage } from './image-search.page';
import { ImageService } from '../../shared/services/image.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { ImageInfo } from 'src/app/core/models/image.model';
import { ImageSearchRequest } from '../../shared/services/image.service.types';

const MOCK_IMAGES: ImageInfo[] = [
  { id: '1', fileName: 'a.jpg', url: 'http://a.com/a.jpg', title: 'Alpha', description: 'desc', tagsList: ['nature'], imageFile: null },
  { id: '2', fileName: 'b.jpg', url: 'http://a.com/b.jpg', title: 'Beta',  description: 'desc', tagsList: ['city'],   imageFile: null },
];

describe('ImageSearchPage', () => {
  let component: ImageSearchPage;
  let fixture: ComponentFixture<ImageSearchPage>;
  let imageServiceMock: jasmine.SpyObj<ImageService>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    imageServiceMock = jasmine.createSpyObj('ImageService', ['search']);
    notificationsServiceMock = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);

    // Default: return empty list so the constructor effect doesn't throw
    imageServiceMock.search.and.returnValue(of({ images: [] }));
    notificationsServiceMock.showError.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [ImageSearchPage],
      providers: [
        provideRouter([]),
        { provide: ImageService, useValue: imageServiceMock },
        { provide: NotificationService, useValue: notificationsServiceMock }
      ]
    });

    fixture = TestBed.createComponent(ImageSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call search on init with empty query and empty tags', () => {
    // The constructor effect fires immediately on detectChanges
    expect(imageServiceMock.search).toHaveBeenCalled();
    const callArgs: ImageSearchRequest = imageServiceMock.search.calls.mostRecent().args[0];
    expect(callArgs.query).toBe('');
    expect(callArgs.tagsList).toEqual([]);
  });

  it('onSearch: updates searchTerm signal and triggers new search', () => {
    imageServiceMock.search.calls.reset();
    imageServiceMock.search.and.returnValue(of({ images: MOCK_IMAGES }));

    const event = { target: { value: 'Alpha' } } as unknown as Event;
    component.onSearch(event);
    fixture.detectChanges();

    expect(component.searchTerm()).toBe('Alpha');
    expect(imageServiceMock.search).toHaveBeenCalled();
    const callArgs: ImageSearchRequest = imageServiceMock.search.calls.mostRecent().args[0];
    expect(callArgs.query).toBe('alpha'); // toLowerCase applied
  });

  it('adding a tag to tagsArray triggers a new search with the tag', fakeAsync(() => {
    imageServiceMock.search.calls.reset();
    imageServiceMock.search.and.returnValue(of({ images: MOCK_IMAGES }));

    component.tagsArray.push(new FormControl('nature', { nonNullable: true }));
    tick(); // allow valueChanges to emit
    fixture.detectChanges();

    expect(imageServiceMock.search).toHaveBeenCalled();
    const callArgs: ImageSearchRequest = imageServiceMock.search.calls.mostRecent().args[0];
    expect(callArgs.tagsList).toContain('nature');
  }));

  it('removing a tag from tagsArray triggers search without the removed tag', fakeAsync(() => {
    // First add a tag
    component.tagsArray.push(new FormControl('nature', { nonNullable: true }));
    tick();
    fixture.detectChanges();

    imageServiceMock.search.calls.reset();
    imageServiceMock.search.and.returnValue(of({ images: [] }));

    // Now remove it
    component.tagsArray.removeAt(0);
    tick();
    fixture.detectChanges();

    expect(imageServiceMock.search).toHaveBeenCalled();
    const callArgs: ImageSearchRequest = imageServiceMock.search.calls.mostRecent().args[0];
    expect(callArgs.tagsList).not.toContain('nature');
    expect(callArgs.tagsList.length).toBe(0);
  }));

  it('should update filteredImages signal with search results', () => {
    imageServiceMock.search.and.returnValue(of({ images: MOCK_IMAGES }));

    const event = { target: { value: 'photo' } } as unknown as Event;
    component.onSearch(event);
    fixture.detectChanges();

    expect(component.filteredImages().length).toBe(2);
    expect(component.filteredImages()[0].title).toBe('Alpha');
  });

  it('should show error notification when search fails', async () => {
    const serverError = { error: { message: 'Service unavailable' } };
    imageServiceMock.search.and.returnValue(throwError(() => serverError));

    const event = { target: { value: 'fail' } } as unknown as Event;
    component.onSearch(event);
    fixture.detectChanges();

    await fixture.whenStable();

    expect(notificationsServiceMock.showError).toHaveBeenCalledWith('Service unavailable');
  });

  it('should show generic error notification when search fails with no server message', async () => {
    imageServiceMock.search.and.returnValue(throwError(() => ({})));

    const event = { target: { value: 'fail' } } as unknown as Event;
    component.onSearch(event);
    fixture.detectChanges();

    await fixture.whenStable();

    expect(notificationsServiceMock.showError).toHaveBeenCalledWith('Could not retrieve images');
  });

  it('createSearchRequest: returns correct structure', () => {
    const req = component.createSearchRequest('hello', ['a', 'b']);
    expect(req).toEqual({ query: 'hello', tagsList: ['a', 'b'] });
  });
});
