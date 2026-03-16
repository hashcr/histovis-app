import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { PinPopoverComponent } from './pin-popover.component';
import { Pin } from 'src/app/core/models/image.model';

function makePinData(overrides: Partial<Pin> = {}): Pin {
  return {
    id: 'pin-1',
    x: 0.2,
    y: 0.3,
    zoom: 1.5,
    sequence_id: 1,
    text: 'Initial note',
    isPublic: true,
    isTemporal: false,
    email: 'user@example.com',
    persisted: true,
    ...overrides,
  };
}

describe('PinPopoverComponent', () => {
  let component: PinPopoverComponent;
  let fixture: ComponentFixture<PinPopoverComponent>;
  let popoverControllerMock: jasmine.SpyObj<PopoverController>;

  function createComponentWithPin(pinData: Pin) {
    fixture = TestBed.createComponent(PinPopoverComponent);
    component = fixture.componentInstance;
    component.pinData = pinData;
    fixture.detectChanges(); // triggers ngOnInit
  }

  beforeEach(waitForAsync(() => {
    popoverControllerMock = jasmine.createSpyObj('PopoverController', ['dismiss']);
    popoverControllerMock.dismiss.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [PinPopoverComponent],
      providers: [
        { provide: PopoverController, useValue: popoverControllerMock }
      ]
    }).compileComponents();
  }));

  // ── Creation ────────────────────────────────────────────────────────────────

  it('should create', () => {
    createComponentWithPin(makePinData());
    expect(component).toBeTruthy();
  });

  // ── ngOnInit initialisation ─────────────────────────────────────────────────

  it('ngOnInit: sets isPersistant to true when pin is not temporal', () => {
    createComponentWithPin(makePinData({ isTemporal: false }));
    expect(component.isPersistant()).toBeTrue();
  });

  it('ngOnInit: sets isPersistant to false when pin is temporal', () => {
    createComponentWithPin(makePinData({ isTemporal: true }));
    expect(component.isPersistant()).toBeFalse();
  });

  it('ngOnInit: sets isPersistant correctly when isTemporal is undefined', () => {
    createComponentWithPin(makePinData({ isTemporal: undefined }));
    // !undefined === true
    expect(component.isPersistant()).toBeTrue();
  });

  it('ngOnInit: sets isPublic from pinData.isPublic when true', () => {
    createComponentWithPin(makePinData({ isPublic: true }));
    expect(component.isPublic()).toBeTrue();
  });

  it('ngOnInit: sets isPublic from pinData.isPublic when false', () => {
    createComponentWithPin(makePinData({ isPublic: false }));
    expect(component.isPublic()).toBeFalse();
  });

  it('ngOnInit: sets noteText from pinData.text', () => {
    createComponentWithPin(makePinData({ text: 'Pre-filled note' }));
    expect(component.noteText.value).toBe('Pre-filled note');
  });

  // ── togglePersistant ────────────────────────────────────────────────────────

  it('togglePersistant: flips isPersistant from true to false', () => {
    createComponentWithPin(makePinData({ isTemporal: false })); // isPersistant = true
    component.togglePersistant();
    fixture.detectChanges();
    expect(component.isPersistant()).toBeFalse();
  });

  it('togglePersistant: flips isPersistant from false to true', () => {
    createComponentWithPin(makePinData({ isTemporal: true })); // isPersistant = false
    component.togglePersistant();
    fixture.detectChanges();
    expect(component.isPersistant()).toBeTrue();
  });

  // ── togglePublic ────────────────────────────────────────────────────────────

  it('togglePublic: flips isPublic from true to false', () => {
    createComponentWithPin(makePinData({ isPublic: true }));
    component.togglePublic();
    fixture.detectChanges();
    expect(component.isPublic()).toBeFalse();
  });

  it('togglePublic: flips isPublic from false to true', () => {
    createComponentWithPin(makePinData({ isPublic: false }));
    component.togglePublic();
    fixture.detectChanges();
    expect(component.isPublic()).toBeTrue();
  });

  // ── onClose ─────────────────────────────────────────────────────────────────

  it('onClose: calls popoverController.dismiss with null and role "close"', () => {
    createComponentWithPin(makePinData());
    component.onClose();
    expect(popoverControllerMock.dismiss).toHaveBeenCalledWith(null, 'close');
  });

  // ── onSave ──────────────────────────────────────────────────────────────────

  it('onSave: updates pinData.text from noteText control', () => {
    createComponentWithPin(makePinData({ text: 'Old text' }));
    component.noteText.setValue('New note text');

    component.onSave();

    expect(component.pinData.text).toBe('New note text');
  });

  it('onSave: updates pinData.isTemporal to !isPersistant (persisted pin → isTemporal false)', () => {
    createComponentWithPin(makePinData({ isTemporal: false })); // isPersistant = true
    expect(component.isPersistant()).toBeTrue();

    component.onSave();

    expect(component.pinData.isTemporal).toBeFalse();
  });

  it('onSave persistent pin: isTemporal is false', () => {
    createComponentWithPin(makePinData({ isTemporal: false })); // isPersistant = true
    component.onSave();
    expect(component.pinData.isTemporal).toBeFalse();
  });

  it('onSave temporal pin: isTemporal is true', () => {
    createComponentWithPin(makePinData({ isTemporal: true })); // isPersistant = false
    component.onSave();
    expect(component.pinData.isTemporal).toBeTrue();
  });

  it('onSave: updates pinData.isPublic from isPublic signal', () => {
    createComponentWithPin(makePinData({ isPublic: true }));
    component.togglePublic(); // set to false
    fixture.detectChanges();

    component.onSave();

    expect(component.pinData.isPublic).toBeFalse();
  });

  it('onSave: calls popoverController.dismiss with pinData and role "save"', () => {
    const pinData = makePinData({ text: 'Save this' });
    createComponentWithPin(pinData);
    component.noteText.setValue('Updated');

    component.onSave();

    expect(popoverControllerMock.dismiss).toHaveBeenCalledWith(
      { pinData: pinData },
      'save'
    );
  });

  it('onSave: dismiss payload contains the mutated pinData', () => {
    const pinData = makePinData({ text: '', isPublic: false, isTemporal: false });
    createComponentWithPin(pinData);

    component.noteText.setValue('Final note');
    component.togglePublic(); // false → true
    fixture.detectChanges();

    component.onSave();

    const dismissArg = popoverControllerMock.dismiss.calls.mostRecent().args[0];
    expect(dismissArg.pinData.text).toBe('Final note');
    expect(dismissArg.pinData.isPublic).toBeTrue();
    expect(dismissArg.pinData.isTemporal).toBeFalse();
  });
});
