import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { PopoverController } from '@ionic/angular/standalone';

import { ImageAnalysisPage } from './image-analysis.page';
import { ImageService } from '../../shared/services/image.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Pin } from 'src/app/core/models/image.model';

function makePinData(overrides: Partial<Pin> = {}): Pin {
  return {
    id: 'pin-id-1',
    x: 0.3,
    y: 0.4,
    zoom: 1,
    sequence_id: 1,
    text: 'Test note',
    isPublic: true,
    isTemporal: false,
    email: 'user@example.com',
    persisted: false,
    ...overrides,
  };
}

describe('ImageAnalysisPage', () => {
  let component: ImageAnalysisPage;
  let fixture: ComponentFixture<ImageAnalysisPage>;

  let imageServiceMock: jasmine.SpyObj<ImageService>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationService>;
  let authServiceMock: { user: jasmine.Spy };
  let popoverControllerMock: jasmine.SpyObj<PopoverController>;

  beforeEach(() => {
    imageServiceMock = jasmine.createSpyObj('ImageService', [
      'get', 'getPins', 'addPin', 'updatePin', 'deletePin'
    ]);
    notificationsServiceMock = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    authServiceMock = { user: jasmine.createSpy('user').and.returnValue({ username: 'user@example.com', firstName: 'Test', lastName: 'User', token: 'tok', isAdmin: false }) };
    popoverControllerMock = jasmine.createSpyObj('PopoverController', ['create', 'present', 'dismiss']);

    // Default safe returns
    imageServiceMock.get.and.returnValue(of({ image: { id: 'img-1', fileName: 'a.jpg', url: 'http://a.com/a.jpg', title: 'Test', description: '', tagsList: [], imageFile: null } }));
    imageServiceMock.getPins.and.returnValue(of({ pins: [] }));
    imageServiceMock.addPin.and.returnValue(of({ pin: makePinData({ id: 'server-uuid', persisted: true }) }));
    imageServiceMock.updatePin.and.returnValue(of({ pin: makePinData({ persisted: true }) }));
    imageServiceMock.deletePin.and.returnValue(of({ deleted: true }));
    notificationsServiceMock.showError.and.returnValue(Promise.resolve());
    notificationsServiceMock.showSuccess.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [ImageAnalysisPage],
      providers: [
        provideRouter(
          [{ path: 'analyze/:id', component: ImageAnalysisPage }],
          withComponentInputBinding()
        ),
        { provide: ImageService, useValue: imageServiceMock },
        { provide: NotificationService, useValue: notificationsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: PopoverController, useValue: popoverControllerMock },
      ]
    });

    fixture = TestBed.createComponent(ImageAnalysisPage);
    component = fixture.componentInstance;
    // Prevent OpenSeadragon from initialising (it can't run in JSDOM)
    spyOn(component as any, 'initViewer');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── showPinsToggle ─────────────────────────────────────────────────────────

  it('showPinsToggle: toggles showingPins signal from false to true', () => {
    expect(component.showingPins()).toBeFalse();
    component.showPinsToggle();
    fixture.detectChanges();
    expect(component.showingPins()).toBeTrue();
  });

  it('showPinsToggle: toggles showingPins signal from true back to false', () => {
    component.showPinsToggle(); // -> true
    fixture.detectChanges();
    component.showPinsToggle(); // -> false
    fixture.detectChanges();
    expect(component.showingPins()).toBeFalse();
  });

  it('showPinsToggle: calls getPins on first show', () => {
    component.imageId.set('img-42');
    imageServiceMock.getPins.calls.reset();

    component.showPinsToggle(); // pinsLoaded = false → should call getPins
    fixture.detectChanges();

    expect(imageServiceMock.getPins).toHaveBeenCalledWith('img-42');
  });

  it('showPinsToggle: does NOT call getPins on second show', () => {
    component.imageId.set('img-42');

    component.showPinsToggle(); // first show — loads pins
    fixture.detectChanges();
    imageServiceMock.getPins.calls.reset();

    component.showPinsToggle(); // hide
    fixture.detectChanges();
    component.showPinsToggle(); // second show — already loaded
    fixture.detectChanges();

    expect(imageServiceMock.getPins).not.toHaveBeenCalled();
  });

  // ── enableDropPinMode / disableDropPinMode ─────────────────────────────────

  it('enableDropPinMode: sets showingPins to true immediately', () => {
    expect(component.showingPins()).toBeFalse();
    component.enableDropPinMode();
    fixture.detectChanges();
    expect(component.showingPins()).toBeTrue();
  });

  it('enableDropPinMode: sets dropPinMode to true after 500ms delay', fakeAsync(() => {
    expect(component.dropPinMode()).toBeFalse();
    component.enableDropPinMode();
    fixture.detectChanges();

    // Before the delay fires, dropPinMode should still be false
    expect(component.dropPinMode()).toBeFalse();

    tick(500);
    fixture.detectChanges();

    expect(component.dropPinMode()).toBeTrue();
  }));

  it('disableDropPinMode: sets dropPinMode to false', fakeAsync(() => {
    component.enableDropPinMode();
    tick(500);
    fixture.detectChanges();
    expect(component.dropPinMode()).toBeTrue();

    component.disableDropPinMode();
    fixture.detectChanges();
    expect(component.dropPinMode()).toBeFalse();
  }));

  // ── searchImage ────────────────────────────────────────────────────────────

  it('searchImage: sets imageId from form control value', () => {
    component.searchImageId.setValue('image-xyz');
    component.searchImage();
    fixture.detectChanges();

    expect(component.imageId()).toBe('image-xyz');
  });

  it('searchImage: trims whitespace before setting imageId', () => {
    component.searchImageId.setValue('  img-99  ');
    component.searchImage();
    fixture.detectChanges();

    expect(component.imageId()).toBe('img-99');
  });

  it('searchImage: does nothing when form control is empty', () => {
    component.imageId.set('original-id');
    component.searchImageId.setValue('');
    component.searchImage();

    expect(component.imageId()).toBe('original-id');
  });

  // ── persistPin (new, non-temporal) → calls imageService.addPin ─────────────

  it('persistPin (new, non-temporal): calls imageService.addPin', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ id: 'pin-id-1', persisted: false, isTemporal: false });

    (component as any).persistPin(pinData);

    expect(imageServiceMock.addPin).toHaveBeenCalledWith('img-1', pinData);
  });

  it('persistPin (new, non-temporal) success: remaps pin id to server uuid in pinMap', () => {
    component.imageId.set('img-1');
    const localId = 'pin-id-local';
    const serverUuid = 'server-uuid-abc';
    const pinData = makePinData({ id: localId, persisted: false, isTemporal: false });

    imageServiceMock.addPin.and.returnValue(of({ pin: { ...pinData, id: serverUuid, persisted: true } }));

    (component as any).persistPin(pinData);

    const pinMap: Map<string, Pin> = (component as any).pinMap;
    expect(pinMap.has(localId)).toBeFalse();
    expect(pinMap.has(serverUuid)).toBeTrue();
    expect(pinMap.get(serverUuid)!.id).toBe(serverUuid);
  });

  it('persistPin (new, non-temporal) success: updates HTML element id', () => {
    component.imageId.set('img-1');
    const localId = 'pin-id-local-html';
    const serverUuid = 'server-uuid-html';

    // Create a real DOM element and append it
    const el = document.createElement('div');
    el.id = localId;
    document.body.appendChild(el);

    const pinData = makePinData({ id: localId, persisted: false, isTemporal: false });
    imageServiceMock.addPin.and.returnValue(of({ pin: { ...pinData, id: serverUuid, persisted: true } }));

    (component as any).persistPin(pinData);

    // The element id should now be the server UUID
    expect(el.id).toBe(serverUuid);

    // Cleanup
    el.remove();
  });

  it('persistPin (persisted, non-temporal): calls imageService.updatePin', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: true, isTemporal: false });

    (component as any).persistPin(pinData);

    expect(imageServiceMock.updatePin).toHaveBeenCalledWith('img-1', pinData);
    expect(imageServiceMock.addPin).not.toHaveBeenCalled();
    expect(imageServiceMock.deletePin).not.toHaveBeenCalled();
  });

  it('persistPin (persisted, temporal): calls imageService.deletePin', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ id: 'del-pin', persisted: true, isTemporal: true });

    (component as any).persistPin(pinData);

    expect(imageServiceMock.deletePin).toHaveBeenCalledWith('img-1', 'del-pin');
    expect(imageServiceMock.addPin).not.toHaveBeenCalled();
    expect(imageServiceMock.updatePin).not.toHaveBeenCalled();
  });

  it('persistPin (new, temporal): does NOT call any API', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: false, isTemporal: true });

    (component as any).persistPin(pinData);

    expect(imageServiceMock.addPin).not.toHaveBeenCalled();
    expect(imageServiceMock.updatePin).not.toHaveBeenCalled();
    expect(imageServiceMock.deletePin).not.toHaveBeenCalled();
  });

  it('persistPin: does nothing when imageId is null', () => {
    component.imageId.set(null);
    const pinData = makePinData({ persisted: false, isTemporal: false });

    (component as any).persistPin(pinData);

    expect(imageServiceMock.addPin).not.toHaveBeenCalled();
    expect(imageServiceMock.updatePin).not.toHaveBeenCalled();
    expect(imageServiceMock.deletePin).not.toHaveBeenCalled();
  });

  // ── presentPopover ─────────────────────────────────────────────────────────

  it('presentPopover with role "save": calls persistPin', async () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: false, isTemporal: false });
    const persistPinSpy = spyOn<any>(component, 'persistPin');

    const mockPopover = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(
        Promise.resolve({ data: { pinData }, role: 'save' })
      ),
    };
    popoverControllerMock.create.and.returnValue(Promise.resolve(mockPopover as any));

    await component.presentPopover(new Event('click'), pinData);

    expect(persistPinSpy).toHaveBeenCalledWith(pinData);
  });

  it('presentPopover with role "close": does NOT call persistPin', async () => {
    component.imageId.set('img-1');
    const pinData = makePinData();
    const persistPinSpy = spyOn<any>(component, 'persistPin');

    const mockPopover = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(
        Promise.resolve({ data: null, role: 'close' })
      ),
    };
    popoverControllerMock.create.and.returnValue(Promise.resolve(mockPopover as any));

    await component.presentPopover(new Event('click'), pinData);

    expect(persistPinSpy).not.toHaveBeenCalled();
  });

  // ── addPin / loadPins ──────────────────────────────────────────────────────

  it('loadPins: calls getPins with the current imageId', () => {
    component.imageId.set('img-33');
    imageServiceMock.getPins.calls.reset();
    // Spy on addPin to prevent needing a real viewer
    spyOn(component, 'addPin');

    (component as any).loadPins();

    expect(imageServiceMock.getPins).toHaveBeenCalledWith('img-33');
  });

  it('loadPins: does nothing when imageId is null', () => {
    component.imageId.set(null);
    imageServiceMock.getPins.calls.reset();

    (component as any).loadPins();

    expect(imageServiceMock.getPins).not.toHaveBeenCalled();
  });

  // ── notifications on pin operations ───────────────────────────────────────

  it('savePin success: shows success notification', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: false, isTemporal: false });
    imageServiceMock.addPin.and.returnValue(of({ pin: { ...pinData, id: 'server-id', persisted: true } }));

    (component as any).persistPin(pinData);

    expect(notificationsServiceMock.showSuccess).toHaveBeenCalledWith('Pin saved successfully');
  });

  it('updatePin success: shows success notification', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: true, isTemporal: false });
    imageServiceMock.updatePin.and.returnValue(of({ pin: pinData }));

    (component as any).persistPin(pinData);

    expect(notificationsServiceMock.showSuccess).toHaveBeenCalledWith('Pin updated successfully');
  });

  it('deletePin success: shows success notification', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: true, isTemporal: true });
    imageServiceMock.deletePin.and.returnValue(of({ deleted: true }));

    (component as any).persistPin(pinData);

    expect(notificationsServiceMock.showSuccess).toHaveBeenCalledWith('Pin deleted successfully');
  });

  it('savePin error: shows error notification with server message', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: false, isTemporal: false });
    imageServiceMock.addPin.and.returnValue(throwError(() => ({ error: { message: 'Pin save failed' } })));

    (component as any).persistPin(pinData);

    expect(notificationsServiceMock.showError).toHaveBeenCalledWith('Pin save failed');
  });

  it('savePin error: shows generic message when no server message', () => {
    component.imageId.set('img-1');
    const pinData = makePinData({ persisted: false, isTemporal: false });
    imageServiceMock.addPin.and.returnValue(throwError(() => ({})));

    (component as any).persistPin(pinData);

    expect(notificationsServiceMock.showError).toHaveBeenCalledWith('Failed to save pin');
  });
});
