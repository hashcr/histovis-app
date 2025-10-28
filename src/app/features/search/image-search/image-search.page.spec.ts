import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageSearchPage } from './image-search.page';
import { ImageService } from '../../shared/services/image.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';

describe('ImageSearchPage', () => {
  let component: ImageSearchPage;
  let fixture: ComponentFixture<ImageSearchPage>;
  let imageSearchServiceMock: jasmine.SpyObj<ImageService>;
  let notificactionsServiceMock: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    imageSearchServiceMock = jasmine.createSpyObj('ImageService', ['search']);
    notificactionsServiceMock = jasmine.createSpyObj('NotificationService', ['showError']);
    
    TestBed.configureTestingModule({
      imports: [ImageSearchPage],
      providers: [
        { provide: ImageService, useValue: imageSearchServiceMock },
        { provide: NotificationService, useValue: notificactionsServiceMock }
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
