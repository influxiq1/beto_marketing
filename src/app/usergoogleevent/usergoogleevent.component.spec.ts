import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergoogleeventComponent } from './usergoogleevent.component';

describe('UsergoogleeventComponent', () => {
  let component: UsergoogleeventComponent;
  let fixture: ComponentFixture<UsergoogleeventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsergoogleeventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsergoogleeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
