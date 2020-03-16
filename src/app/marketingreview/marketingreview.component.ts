import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Commonservices } from '../app.commonservices';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http';
declare var moment: any;
 

 

@Component({
  selector: 'app-marketingreview',
  templateUrl: './marketingreview.component.html',
  styleUrls: ['./marketingreview.component.css'],
  providers: [Commonservices]
})
export class MarketingreviewComponent implements OnInit {

  public timezoneval:any;
  public filterval5:any;
  public product_id: any = '';
  public allslots: any;
  public allslotslength: any;
  public timezone: any = '';
  public leadData: any = '';
  public lead_id: any = '';
  constructor(public _commonservice: Commonservices, public modal: BsModalService, public _http: HttpClient, public cookeiservice: CookieService, public activatedroute: ActivatedRoute, public router: Router) {
   if (activatedroute.snapshot.params['lead_id'] != null) {
    this.lead_id = activatedroute.snapshot.params['lead_id'];
    this.activatedroute.data.forEach((data:any ) => {
      this.leadData = data.results.res;
      console.log(this.leadData)
   });
   }
    this.product_id = activatedroute.snapshot.params['product_id'];
    this._http.get("assets/data/timezone.json")
          .subscribe((res:any) => {
              this.timezone=res;
              this.timezoneval=this.cookeiservice.get('timezone');
          }, error => {
              console.log('Oooops!');
          });
   }

   settimezone(){
    this.cookeiservice.set('timezone',this.timezoneval);
    setTimeout(()=>{
      this.geteventarr();
    },1000);
  //   this.window.location.reload();
  }

  setdatetonull() {
    this.filterval5 = null;
    this.geteventarr();
  }

  geteventarr() {
    let cond: any;
    if (this.filterval5 != null && this.filterval5 != '') {
      cond = {
        "is_discovery": false, "is_onboarding": false, "is_qna": false, "is_custom": false, "userproducts": { "$in": [this.product_id] }, slots: { $type: 'array' }, startdate: {
          $lte: moment(this.filterval5[1]).format('YYYY-MM-DD'),
          $gte: moment(this.filterval5[0]).format('YYYY-MM-DD')
        }
      };
    } else {
      cond = {
        "is_discovery": false, "is_onboarding": false, "is_qna": false, "is_custom": false, "userproducts": { "$in": [this.product_id] }, slots: { $type: 'array' }, startdate: {
          $lte: moment().add(2, 'weeks').format('YYYY-MM-DD'),
          $gt: moment().subtract(1, 'days').format('YYYY-MM-DD')
        }
      };
      console.log('cond', cond);
    }
    const link = this._commonservice.nodesslurl + 'datalistforslot';
    this._http.post(link, { condition: cond }).subscribe((res:any) => {
      this.allslots = res.res;
      this.allslotslength = res.resc;
      // console.log('allslots', this.allslots, this.allslots.length);
    });
  }


  ngOnInit() {
    this.slotview();
  }

  slotview(){
    let cond = { "is_discovery": false, "is_onboarding": false, "is_qna": false, "is_custom": false, "userproducts": { "$in": [this.product_id]}, slots:{$type:'array'}, startdate:{
      $lte: moment().add(2, 'weeks').format('YYYY-MM-DD'),
      $gt: moment().subtract(1, 'days').format('YYYY-MM-DD')
  }};

  const link = this._commonservice.nodesslurl + 'datalistforslot';
        this._http.post(link,{condition:cond}).subscribe((res:any) => {
            this.allslots = res.res;
            this.allslotslength = res.resc;
            // console.log('allslots',this.allslots,this.allslots.length);
        });
  }
}
