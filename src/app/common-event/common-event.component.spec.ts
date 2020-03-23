import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEventComponent } from './common-event.component';

describe('CommonEventComponent', () => {
  let component: CommonEventComponent;
  let fixture: ComponentFixture<CommonEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
