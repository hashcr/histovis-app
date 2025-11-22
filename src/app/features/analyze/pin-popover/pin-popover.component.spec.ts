import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { PinPopoverComponent } from './pin-popover.component';

describe('PinPopoverComponent', () => {
  let popoverControllerMock: jasmine.SpyObj<PopoverController>;
  let component: PinPopoverComponent;
  let fixture: ComponentFixture<PinPopoverComponent>;
  let INPUT_PIN_DATA = { id: '1', x: 0, y: 0, text: '', isPublic: false, isTemporal: undefined, email: '', sequence_id: 0, zoom: 1 };

  beforeEach(waitForAsync(() => {
    popoverControllerMock = jasmine.createSpyObj('PopoverController', ['dismiss']);
    TestBed.configureTestingModule({
      imports: [PinPopoverComponent],
      providers: [
        { provide: PopoverController, useValue: popoverControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PinPopoverComponent);
    component = fixture.componentInstance;
    component.pinData = INPUT_PIN_DATA;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
