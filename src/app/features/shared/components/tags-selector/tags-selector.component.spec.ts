import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagsSelectorComponent } from './tags-selector.component';

describe('TagsSelectorComponent', () => {
  let component: TagsSelectorComponent;
  let fixture: ComponentFixture<TagsSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TagsSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
