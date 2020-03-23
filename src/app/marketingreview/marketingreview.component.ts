import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Commonservices } from '../app.commonservices';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  public rep_data: any = '';
  public youtube_url: any = [
    {'product_id':"5dd68c367b583967f3e57312", 'link':"https://www.youtube.com/embed/8qkgcCBOQM4", 'start':0, 'second_start':75},
    {'product_id':"5dd68c367b583967f3e573r2", 'link':"https://www.youtube.com/embed/8qkgcCBOQM4", 'start':0, 'second_start':75},
    {'product_id':"5d4d5e8cc9e23d43cc124394", 'link':"https://www.youtube.com/embed/8qkgcCBOQM4", 'start':0, 'second_start':75},
    {'product_id':"5dd68c367b583967f3e573x2", 'link':"https://www.youtube.com/embed/8qkgcCBOQM4", 'start':0, 'second_start':75},
    {'product_id':"5dd68c367b583967f3e573h2", 'link':"https://www.youtube.com/embed/8qkgcCBOQM4", 'start':0, 'second_start':75},
    {'product_id':"5dd68c367b583967f3e573b2", 'link':"https://www.youtube.com/embed/8qkgcCBOQM4", 'start':0, 'second_start':175},
  ]
  public safeSrc:SafeResourceUrl;
  constructor(public _commonservice: Commonservices, public modal: BsModalService, public _http: HttpClient, public cookeiservice: CookieService, public activatedroute: ActivatedRoute, public router: Router, private sanitizer: DomSanitizer) {

    for (const key in this.youtube_url) {
      this.youtube_url[key].safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url[key].link);
    }
    if (activatedroute.snapshot.params['lead_id'] != null) {
      this.lead_id = activatedroute.snapshot.params['lead_id'];
      this.activatedroute.data.forEach((data: any) => {
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

    console.log(this.product_id)
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
  startTime(item: any, flag: any){
    console.log(item)
  //   this.youtube_url[key].safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.youtube_url[key].link);
  if (flag == '1') {
    item.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(item.link+'?start='+item.start+'?autoplay=1');
  } else {
    item.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(item.link+'?start='+item.second_start+'?autoplay=1');
  }
   console.log(item.safeSrc)
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
    this._http.post(link, {rep_id: this.activatedroute.snapshot.params['rep_id'], condition: cond }).subscribe((res:any) => {
      this.allslots = res.data.slots_data;
      this.allslotslength = res.data.slots_data.length;
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
        this._http.post(link,{rep_id: this.activatedroute.snapshot.params['rep_id'], condition:cond}).subscribe((res:any) => {
            this.allslots = res.data.slots_data;
            this.allslotslength = res.data.slots_data.length;
            this.rep_data = res.data.rep_data[0];
            console.log('allslots',this.rep_data);
        });
  }
}
