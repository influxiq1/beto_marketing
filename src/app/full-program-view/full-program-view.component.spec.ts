import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullProgramViewComponent } from './full-program-view.component';

describe('FullProgramViewComponent', () => {
  let component: FullProgramViewComponent;
  let fixture: ComponentFixture<FullProgramViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullProgramViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullProgramViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
