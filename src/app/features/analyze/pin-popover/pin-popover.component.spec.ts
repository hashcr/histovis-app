import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PinPopoverComponent } from './pin-popover.component';

describe('PinPopoverComponent', () => {
  let component: PinPopoverComponent;
  let fixture: ComponentFixture<PinPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PinPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PinPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
