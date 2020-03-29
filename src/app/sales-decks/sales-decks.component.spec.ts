import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDecksComponent } from './sales-decks.component';

describe('SalesDecksComponent', () => {
  let component: SalesDecksComponent;
  let fixture: ComponentFixture<SalesDecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesDecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
