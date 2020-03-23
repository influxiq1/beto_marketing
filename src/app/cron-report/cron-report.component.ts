import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cron-report',
  templateUrl: './cron-report.component.html',
  styleUrls: ['./cron-report.component.css']
})
export class CronReportComponent implements OnInit {
public sourcecondition: any;
public tabledatalist: any;
  constructor() {
      this.sourcecondition = {};
      this.tabledatalist = [
        { value: 'id', name: 'Id', role: 0, func: '', class: 'id', type: '#' },
        { value: 'type', name: 'Type', role: 0, func: '', class: 'type', type: 'text' },
        { value: 'insertedon', name: 'Insertedon ', role: 0, func: '', class: 'insertedon', type: 'unixTime' }
      ];
   }

  ngOnInit() {
  }

}
