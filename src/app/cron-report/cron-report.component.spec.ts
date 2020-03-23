import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronReportComponent } from './cron-report.component';

describe('CronReportComponent', () => {
  let component: CronReportComponent;
  let fixture: ComponentFixture<CronReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
