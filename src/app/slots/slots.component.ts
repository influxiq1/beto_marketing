import {Component, OnInit, Input, TemplateRef, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from "../app.commonservices";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators,FormControl, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {ModalOptions} from "ngx-bootstrap";
import { WINDOW } from '@ng-toolkit/universal';
declare var moment;
declare var $:any;

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit {

  public slotdata:any;
  modalRef: BsModalRef;
  public dataForm: FormGroup;
  public dataFormForLead: FormGroup;
  public medicalform:FormGroup;
  public kp;
  public leaddata:any='';
  public start_time;
  public end_time;
  public mydetails;
  public slotvalue:any='';
  public slotvalue2:any='';
  public timezoneshow:any='';
  public itemidval:any;
  public mymodal:any;
  public modalRef2: BsModalRef;
  public modalRef1: BsModalRef;
  public message:any;
  public timezoneval:any='';
  public participantPhNumber: any;
  public participantName: any;
  public participantEmail: any;
  public loader: boolean = false;
  public selectedproduct:any;
  public specialityarray:any = [];
  public googleeventval:any = '';
  public slotDataStatus: any = '';
  public isflagval: any;
  public productval: any;
  public doctorspeciality:any = [
    {name:"Family Medicine",value:"Family Medicine"},
    {name:"Neurology",value:"Neurology"},
    {name:"D.O. Doctor of Osteopathy",value:"D.O. Doctor of Osteopathy"},
    {name:"General Practice",value:"General Practice"},
    {name:"Internal Medicine",value:"Internal Medicine"},
    {name:"Pain Mgmt (Integrated Practice)",value:"Pain Mgmt"},
    {name:"Primary Care",value:"Primary Care"},
    {name:"Endocrinology",value:"Endocrinology"},
    {name:"Integrated Speciality Groups",value:"Integrated Speciality Groups"},
    {name:"Cardiology",value:"Cardiology"}
];

  bsDatepicker = {
    format: 'DD/MM/YYYY',
    minDate: moment().format("DD/MM/YYYY"),
    noDefaultRangeSelected : true
  }


  @Input()
  set itemid(item: any) {
    this.itemidval = (item) || 0;
  }


  @Input()
  set isflag(item: any) {
    this.isflagval = (item) || '<no name set>';
    // console.log(item,'++++')
  }
  
  @Input()
  set itemdata(item: any) {
    this.slotdata = (item) || '<no name set>';
  }
  @Input()
  set googleevent(item: any) {
    this.googleeventval = (item) || '<no name set>';
    // console.log(this.googleeventval,item)
  }

public bookNowStatus:boolean = true;
  constructor(@Inject(WINDOW) private window: Window, public _commonservices:Commonservices,public modal:BsModalService,kp: FormBuilder, private cookeiservice: CookieService,public _http:HttpClient, public route: ActivatedRoute, public router: Router) {
    // if (this.route.snapshot.routeConfig.path =='marketing-review/:product_id' || this.route.snapshot.routeConfig.path =='marketing-review/:product_id/:rep_id/:lead_id') {
      this.bookNowStatus = false;
    // } else {
    //   this.bookNowStatus = true;
    // }
    this.kp = kp;
    this.selectedproduct = this.cookeiservice.get('lead-product');
    this.timezoneval=this.cookeiservice.get('timezone');
    this.dataForm = this.kp.group({
      /*  description: ['',Validators.required],*/
      meeting_with: [''],
      participant: [this.cookeiservice.get('useremail')],
    /*  startdate: ['',Validators.required],
      starttime: ['',Validators.required],
      enddate: ['',Validators.required],
      endtime: ['',Validators.required],
      timezone: ['',Validators.required],*/
      repsmsg: [''],
    });
  }

  getslot(){

    this.participantEmail = this.cookeiservice.get('useremail');
    this.participantName = this.cookeiservice.get('fname');
    this.participantPhNumber = this.cookeiservice.get('phone');
    if(this.timezoneval!='' && this.timezoneval.length>2 && this.slotdata.timezone!=this.timezoneval){
      let now = moment();
      let tz=this.slotdata.timezone.split('|');
      tz=tz[1];
      //var localOffset = now.utcOffset();
      now.tz(tz); // your time zone, not necessarily the server's
      let centralOffset = now.utcOffset();
      let tz1=this.timezoneval.split('|');
      tz1=tz1[1];
      now.tz(tz1);
      let centralOffset1 = now.utcOffset();
      let diffInMinutes = centralOffset1 - centralOffset;
     // console.log('offset'+this.timezoneval+this.slotdata.timezone);
    //  console.log(diffInMinutes);
     // console.log(tz);
    //  console.log(tz1);
      let a=moment(this.slotdata.startdate+'T'+this.slotdata.slots[this.itemidval].trim()+':00');
      let starttime= moment(a).add(diffInMinutes, 'minutes').format('hh:mm A');
      let endtime = moment(a).add(diffInMinutes, 'minutes').add(this.slotdata.timespan, 'minutes').format('hh:mm A');
      this.slotvalue= starttime +' - '+endtime;
      this.slotvalue2= starttime ;
      this.timezoneshow=this.timezoneval;

    }else {
     // console.log('no offset'+this.timezoneval+this.slotdata.timezone);

      let a = moment(this.slotdata.startdate + 'T' + this.slotdata.slots[this.itemidval].trim() + ':00');
      let starttime = a.format('hh:mm A');
      let endtime = moment(a).add(this.slotdata.timespan, 'minutes').format('hh:mm A');
      this.slotvalue = starttime + ' - ' + endtime;
        this.slotvalue2= starttime ;
      this.timezoneshow=this.slotdata.timezone;
    }
    //return this.slotvalue;
  }

  ngOnInit() {
    setTimeout(() => {
      this.getslot();
    },0);

   // console.log('refreshtoken');
   // console.log(this.cookeiservice.get('refreshtoken').length);
   // console.log(this.cookeiservice.get('refreshtoken'));
   // console.log(typeof (this.cookeiservice.get('refreshtoken')));
  /*  if(this.cookeiservice.get('refreshtoken')==null ||  this.cookeiservice.get('refreshtoken').length<12 ){
      this.getrepdetails();
    }*/
  }
/*  getrepdetails(){
    const link = this._commonservices.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
    this._http.post(link,{source:'users',condition:{_id_object:this.cookeiservice.get('userid')}})
        .subscribe(res => {
          let result:any;
          result = res;
          if(result.status=='error'){
          }else{
            this.mydetails = result.res;
            console.log('this.mydetails');
            console.log(this.mydetails);
            //this.cookeiservice.set('refreshtoken', this.mydetails[0].regionalrecruiter_id);


            const link = this._commonservices.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
            this._http.post(link,{source:'users',condition:{_id_object:this.mydetails[0].regionalrecruiter_id}})
                .subscribe(res => {
                  let result:any;
                  result = res;
                  if(result.status=='error'){
                  }else{
                    //this.mydetails = result.res;
                    console.log('this.regional details');
                    console.log(result.res);
                    console.log(result.res[0]);
                    console.log(result.res[0].refreshtoken);
                    this.cookeiservice.set('refreshtoken', result.res[0].refreshtoken);






                  }
                }, error => {
                  console.log('Oooops!');
                });



          }
        }, error => {
          console.log('Oooops!');
        });
  }*/
  booknowmodal(template:TemplateRef<any>, slotdata,template1:TemplateRef<any>) {
      const config: ModalOptions = {
          backdrop: 'static',
          class: 'booknowmodal',
          keyboard: false,
          animated: true,
          ignoreBackdropClick: true,
          initialState: {
              data1: 'new-user',
              username: 'test'
          }
      };
    this.getUserDetails(slotdata.allslotsuserid);

    // console.log('/**/*/*/*/**/*/*/*/*/*/*/*/*/*',this.cookeiservice.get('useremail'));
    // console.log(slotdata);

    this.mymodal = template1;
    let leadsId: any = this.cookeiservice.get('leadsId');
    switch(this.route.snapshot.url[0].path) {
      case 'book-a-closer':
        // console.log('BOOK A CLOSER');
        // if(slotdata.userproducts.indexOf(this._commonservices.productid)>-1)
        // {
        //   this.selectedproduct = this._commonservices.productid;
        // }
        // console.log('result.res[0]---');

        const link = this._commonservices.nodesslurl + 'datalist?token=' + this.cookeiservice.get('jwttoken');
        this._http.post(link, { source:'leads_view', condition: { "_id": leadsId }}).subscribe(res => {
          let result: any = res;
          if(this.selectedproduct == this._commonservices.productid){
            this.dataForm = this.kp.group({
              meeting_with: [ slotdata.meetingwith ],
              participant: [ result.res[0].email, Validators.required ],
              participantName: [ result.res[0].fullname, Validators.required ],
              participantPhNumber: [ result.res[0].phoneno, Validators.required ],
              repsmsg: [''],
              doctor_details: this.kp.array([
                this.kp.group({
                  totalpatients:[ "",Validators.required],
                  medicare_patients:[ "" ,Validators.required],
                  medicaid_patients:[ "", Validators.required],
                  cash_payers:[ "", Validators.required],
                  pvt_insuarance_patients:[ "", Validators.required],
                  sixteen_year_patients:["",Validators.required],
                  speciality:[""],
                  Family_Medicine:[""],
                  Neurology:[""],
                  Doctor_of_Osteopathy:[""],
                  General_Practice:[""],
                  Internal_Medicine:[""],
                  Pain_Mgmt:[""],
                  Primary_Care:[""],
                  Endocrinology:[""],
                  Integrated_Speciality_Groups:[""],
                  Cardiology:[""],
                  npi:["",Validators.required],
                  doctor_name:["",Validators.required]
                })
              ]),
              // totalpatients:[ "",Validators.required],
              // medicare_patients:[ "" ,Validators.required],
              // medicaid_patients:[ "", Validators.required],
              // cash_payers:[ "", Validators.required],
              // pvt_insuarance_patients:[ "", Validators.required],
              // sixteen_year_patients:["",Validators.required],
              // speciality:["", Validators.required],
              // npi:["",Validators.required],
              // doctor_name:["",Validators.required],
            });
          }else{
            // console.log('result.res[0]');
            // console.log(result.res[0]);
            // console.log(result.res[0].fullname);
            this.dataForm = this.kp.group({
              meeting_with: [ slotdata.meetingwith ],
              participant: [ result.res[0].email, Validators.required ],
              participantName: [ result.res[0].fullname, Validators.required ],
              participantPhNumber: [ result.res[0].phoneno, Validators.required ],
              repsmsg: ['']
            });
          }



            const config: ModalOptions = {
                backdrop: 'static',
                class: 'booknowmodal',
                keyboard: false,
                animated: true,
                ignoreBackdropClick: true,
                initialState: {
                    data1: 'new-user',
                    username: 'test'
                }
            };

          if(result.res!=null && result.res[0]!=null)this.leaddata=result.res[0];
          setTimeout(() => {
            this.modalRef = this.modal.show(template, config);
          }, 2000);
        });
        break;
        case 'marketing-review':
          const link1 = this._commonservices.nodesslurl + 'datalistforleaddata';
          this._http.post(link1, { source:'leads_view', condition: { _id_object: this.route.snapshot.params['lead_id'] }}).subscribe(res => {
            let result: any = res;
              this.dataForm = this.kp.group({
                meeting_with: [ slotdata.meetingwith ],
                participant: [ result.res[0].email, Validators.required ],
                participantName: [ result.res[0].fullname, Validators.required ],
                participantPhNumber: [ result.res[0].phoneno, Validators.required ],
                repsmsg: ['']
              });


            });
      default:
        setTimeout(() => {
          this.modalRef = this.modal.show(template, config);
        }, 1000);

        this.dataForm = this.kp.group({
          /*  description: [slotdata.description,Validators.required],*/
          meeting_with:         [ slotdata.meetingwith ],
          participant:          [ this.cookeiservice.get('useremail'),Validators.required],
          participantName:      [ this.cookeiservice.get('fullname'), Validators.required],
          participantPhNumber:  [ this.cookeiservice.get('phone'), Validators.required],
          repsmsg: [''],
          });

          // this.dataForm.patchValue({ participantPhNumber: this.participantPhNumber });
          setTimeout(()=>{
            // console.log(this.cookeiservice.get('fullname'));
            // console.log(this.cookeiservice.get('phone'));
            this.dataForm.controls['participantPhNumber'].setValue( this.participantPhNumber );
            // console.log('phoneno - '+this.dataForm.controls['participantPhNumber'].value);
          }, 100);

        break;
    }
  }
  booknowmodal_appointmentlist1(val: any = {}, template2:TemplateRef<any>){
          // setTimeout(() => {
          //   this.modalRef2.hide();
          // }, 1000);
          this.slotdata = val;

    this.modalRef2 = this.modal.show(template2);
    // console.log('pkoklk',this.leaddata ,'+++++++', val);
    if (typeof(this.route.snapshot.params['lead_id']) == 'undefined' || this.route.snapshot.params['lead_id'] == null) {
      const link1 = this._commonservices.nodesslurl + 'datalistforleaddata';
      this._http.post(link1, { source:'products_name', condition: { _id_object: this.route.snapshot.params['product_id'] }}).subscribe((res:any) => {
        this.productval = res.res;
      this.dataFormForLead = this.kp.group({
        firstname: [ '', Validators.required ],
        lastname: [ '', Validators.required ],
        company: [ '', Validators.required ],
        email: [ '', Validators.required ],
        address: [ '', Validators.required ],
        phoneno: [ '', Validators.required ],
        product:[res.res[0]._id]
      });
    });
    } else {
      const link1 = this._commonservices.nodesslurl + 'datalistforleaddata';
      this._http.post(link1, { source:'leads_view', condition: { _id_object: this.route.snapshot.params['lead_id'] }}).subscribe((res:any) => {
        this.leaddata = res.res[0];
      this.dataFormForLead = this.kp.group({
        firstname: [ '', Validators.required ],
        lastname: [ '', Validators.required ],
        company: [ '', Validators.required ],
        email: [ res.res[0].email, Validators.required ],
        address: [ '', Validators.required ],
        phoneno: [ '', Validators.required ],
        product:[res.res[0].product]
      });
      });
    } 
  }

  dosubmitForLead(template:TemplateRef<any>,template1:TemplateRef<any>){
      // console.log(this.dataFormForLead.value);
      let y: any;
        for (y in this.dataFormForLead.controls) {
            this.dataFormForLead.controls[y].markAsTouched();
        }
        if(this.dataFormForLead.valid){
        const link = this._commonservices.nodesslurl + 'addorupdatedata';
        this.dataFormForLead.value.id = this.leaddata._id;
            this._http.post(link, { source: 'leads', data: this.dataFormForLead.value, sourceobj: ['created_by']  })
                .subscribe((res:any) => {
                  if(res.status == 'success'){
                    this.modalRef2.hide();
                    setTimeout(() => {
                      this.booknowmodal(template, this.slotdata,template1);
                    }, 500);
                  }
                });
              }

  }
  booknowmodal_appointmentlist(val: any = {}, template2:TemplateRef<any>){
    // console.log(this.googleeventval);
    // console.log(val);
    val.prvslot = this.googleeventval.prvslot;
    val.prv_id = this.googleeventval.prv_id;
    // console.log(val,"======+++++")
    let timeZone = val.timezone;
    timeZone = timeZone.slice(0,6);
    // console.log(timeZone,'+++++');
    let start_time =  (moment(this.slotdata.startdate + 'T' + this.slotdata.slots[this.itemidval].trim() + ':00').format('YYYY-MM-DDTHH:mm:ss')+timeZone);
    let end_time =(moment(this.slotdata.startdate + 'T' + this.slotdata.slots[this.itemidval].trim() + ':00').add(this.slotdata.timespan, 'minutes').format('YYYY-MM-DDTHH:mm:ss')+timeZone);
        
    // let start = val.startdate+'T'+val.starttime+':00'+timeZone;
    // let end = val.startdate+'T'+val.endtime+':00'+timeZone;
    // console.log('=======',start_time,end_time)
    let link = "https://gapi.betoparedes.com/updateevent.php?event="+this.googleeventval.googleevent+"&start="+start_time+"&end="+end_time+"&refresh_token="+this.googleeventval.refresh_token+"&summary="+val.meetingwith;

    this._http.get(link)
    .subscribe((res:any) => {
      // console.log(res.status);
        if (res.status == 'success') {
          this.modalRef2 = this.modal.show(template2);
          setTimeout(() => {
            this.modalRef2.hide();
          }, 1000);
          let link1 = this._commonservices.nodesslurl + 'rescheduletocalendar';
          this._http.post(link1, val)
      .subscribe((res1:any) => {
        // console.log(res1);
      })
        }
      });
  }

// functions to delete and add form group
removeFormControl(i) {
  let usersArray = this.dataForm.controls.doctor_details as FormArray;
  usersArray.removeAt(i);
}

addFormControl() {
  let usersArray = this.dataForm.controls.doctor_details as FormArray;
  let arraylen = usersArray.length;

  let newUsergroup: FormGroup = this.kp.group({
    totalpatients:[ "",Validators.required],
                  medicare_patients:[ "" ,Validators.required],
                  medicaid_patients:[ "", Validators.required],
                  cash_payers:[ "", Validators.required],
                  pvt_insuarance_patients:[ "", Validators.required],
                  sixteen_year_patients:["",Validators.required],
                  speciality:[""],
                  Family_Medicine:[""],
                  Neurology:[""],
                  Doctor_of_Osteopathy:[""],
                  General_Practice:[""],
                  Internal_Medicine:[""],
                  Pain_Mgmt:[""],
                  Primary_Care:[""],
                  Endocrinology:[""],
                  Integrated_Speciality_Groups:[""],
                  Cardiology:[""],
                  npi:["",Validators.required],
                  doctor_name:["",Validators.required]
  })

  usersArray.insert(arraylen, newUsergroup);
}


showformat(stdt){
    return moment(stdt).format('dddd MMMM DD, YYYY');
}
  dosubmit(){
    let x: any;
    let doctor_details: any;
    let closername:any='';
    let closeremail:any='';
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
    }
    if (!this.dataForm.valid) {
      // console.log('error in validation');
      // console.log(this.dataForm.value);
      // console.log(this.dataForm.valid);
      return;
    }
    else {
      this.loader = true;
      this.modaloff();
      // console.log('=============================================================');
      // console.log('valid', this.dataForm.valid);
      // console.log('valid', this.dataForm.value, this.slotdata.timespan);
      //console.log('valid');
      //return;
      let link = this._commonservices.nodesslurl + 'addtocalendar';


      /*   {"refresh_token": "1/fkzUmqGX5zQ7Z_fn-EXa-ZM7u-DWTeiXhPJ7UiNQ3m8","start_time":"2019-05-08T10:00:00" ,"end_time":"2019-05-08T12:00:00","timezone":"America/Los_Angeles","summery":"Debasis test event !!","attendees":["debasis218@gmail.com","abc@yopmail.com"]}
         */
      // let attendeesarr=[this.cookeiservice.get('useremail')];
      let attendeesarr = [this.dataForm.controls['participant'].value];
      //  console.log('start---');
      //  console.log(slotdata.startdate);
      /* console.log($('.startdt').val());
         console.log($('.enddt').val());
         console.log($('.tm1').val());
         console.log($('.tm2').val());
         console.log('this.start_time');
         console.log(this.start_time);
         console.log(moment(this.start_time).format('HH:mm'));
         console.log(moment(this.end_time).format('HH:mm'));
         console.log(this.end_time);*/
      let tz = this.slotdata.timezone.split('|');
      /*   console.log(this.slotdata.starttime);
         console.log(this.slotdata.endtime);*/
      let ival = this.itemidval;
      let repmsg = '';
      let description: any = this.slotdata.description;

      if (this.dataForm.controls['repsmsg'].value.length > 0 && this.route.snapshot.url[0].path!='book-a-closer') {
        description += '<br /><br /><br />Notes from rep. <br />' + this.dataForm.controls['repsmsg'].value;
      }else{
        repmsg=this.dataForm.controls['repsmsg'].value;
        closeremail=this.cookeiservice.get('useremail');
        closername=this.cookeiservice.get('fullname');
        //attendeesarr.push(this.cookeiservice.get('useremail'));

      }

      if(this.dataForm.controls['doctor_details']==null || this.dataForm.controls['doctor_details'].value !=null ){
        doctor_details='';
      }
      else{
        doctor_details=this.dataForm.controls['doctor_details'].value;
      }

      let data = {
        refresh_token: this.cookeiservice.get('refreshtoken'),
        organizerid: this.cookeiservice.get('organizerid'),
        /* start_time:moment($('.startdt').val()).format('YYYY-MM-DD')+'T'+moment(this.start_time).format('HH:mm:ss'),
             end_time:moment($('.enddt').val()).format('YYYY-MM-DD')+'T'+moment(this.end_time).format('HH:mm:ss'),*/
        startdate: this.slotdata.startdate,
        start_time: moment(this.slotdata.startdate + 'T' + this.slotdata.slots[this.itemidval].trim() + ':00').format('YYYY-MM-DDTHH:mm:ss'),
        end_time: moment(this.slotdata.startdate + 'T' + this.slotdata.slots[this.itemidval].trim() + ':00').add(this.slotdata.timespan, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        timezone: tz[1],
        summery: this.dataForm.controls['meeting_with'].value,
        attendees: attendeesarr,
        repsmsg: description,
        id: this.slotdata.eventid,
        eid: this.slotdata._id,
        name: this.dataForm.controls['participantName'].value,
        phoneNumber: this.dataForm.controls['participantPhNumber'].value,
        slots: this.slotdata.slots,
        //nslots:this.slotdata.slots.splice(ival,1),
        slot: this.slotdata.slots[this.itemidval],
        doctor_details: doctor_details,
        ival: this.itemidval,
        timespan: this.slotdata.timespan,
        booked_by: this.cookeiservice.get('userid'),
        custommsg: repmsg,
        leaddata: this.leaddata,
        closername: closername,
        closeremail: closeremail,
        slotdata: this.slotdata,
        productid: this.cookeiservice.get('lead-product'),
        viewonlyaccess: this.cookeiservice.get('viewonlyaccess'),
        type: this.route.snapshot.url[0].path
      };
      // console.log('data--------');
      // console.log(data.end_time+''+tz[0]);
      this.loader = true;
      let link1 = 'https://gapi.betoparedes.com/check_ability.php?refresh_token='+this.cookeiservice.get('refreshtoken')+'&start='+data.start_time+''+tz[0] +'&end='+ data.end_time+''+tz[0];
      // console.log(link1)

      this._http.get(link1)
      .subscribe((res:any) => {
        // console.log(res);
        this.slotDataStatus = res;
        if (res == 0) {
          this._http.post(link, data)
          .subscribe(res => {
            let result: any = res;
            // console.log('result.... for google calendar');
            // console.log(result);
            this.modalRef.hide();
            this.message = "Your Booking done successfully !!";
            //this.modalRef=this.modal.show(this.mymodal, {class: 'successmodal'});
  
            this.cookeiservice.delete('leadsId');
            this.cookeiservice.delete('viewonlyaccess');
            switch (this.route.snapshot.url[0].path) {
              case 'on-boarding-call':
                this.router.navigate(['/on-boarding-call-booked/' + this.route.snapshot.url[1].path + '/' + result.gdata]);
                break;
              case 'is_discovery':
                this.router.navigate(['/on-boarding-call-booked/' + this.route.snapshot.url[1].path + '/' + result.gdata]);
                break;
              case 'book-a-closer':
                this.cookeiservice.delete('lead-product');
                this.modalRef = this.modal.show(this.mymodal, {class: 'successmodal'});
                this.route.paramMap.subscribe(params => {
                  if(!params.get("id")) {
                    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                    // this.router.navigate(['/book-a-closer/' + random]);
                    this.router.navigate(['/repdashboard']);
                  } else {
                    this.router.navigate(['/book-a-closer']);
  
                  }
                });
                break;
              default:
                // console.log(this.route.snapshot.url[0].path,'+++++++',result.gdata)
                this.router.navigate(['/on-boarding-call-booked/' + 'us7ag61k4r9306plvmilbot9jk' + '/' + result.gdata]);
                break;
            }
            // setTimeout(() => {
            //   window.location.reload();
            // },5000);
            //this.router.navigate(['/reptrainingcenter'])
          });
        } else {
          // this.modalRef.hide();
          // this.message = "Sorry, This slot just got occupied ! \n Please select another convenient slot.";
          // this.modalRef = this.modal.show(this.mymodal, {class: 'successmodal'});
          this.loader = false;
        }
      });
      // return;

    }
  }
  // }
  showtime(item,eachslots){
    var a=moment(item.startdate+'T'+eachslots.trim()+':00');
    var starttime= a.format('hh.mm A');
    var endtime = moment(a).add(30, 'minutes').format('hh.mm A');
    return starttime +' - '+endtime;
  }
  modaloff(){
    this.modalRef.hide();
  }

  /* Get user details */
  getUserDetails(id) {
    let link:any;
    // if (this.route.snapshot.routeConfig.path == 'marketing-review/:product_id/:rep_id/:lead_id') {
     link = this._commonservices.nodesslurl + 'datalistforleaddata';
    this._http.post(link, { source:'users', condition: { _id_object: id }})
      .subscribe(res => {
        let result: any = res;
        // console.log('===== Refresh Token =====');
        // console.log(result.res[0].refreshtoken);
        // console.log(result.res[0]);
        this.cookeiservice.set('refreshtoken', result.res[0].refreshtoken);
        this.cookeiservice.set('organizerid', result.res[0].email);
        // console.log('viewonlyaccess');
        if (result.res[0] != null && result.res[0].viewonlyaccess != null && result.res[0].viewonlyaccess == true) {
          this.cookeiservice.set('viewonlyaccess', result.res[0].viewonlyaccess);
        } else {

          this.cookeiservice.set('viewonlyaccess', 'false');
}
        // this.participantName = result.res[0].firstname + ' ' + result.res[0].lastname;
        // this.participantPhNumber = result.res[0].phoneno;
        // console.log(this.participantPhNumber);
      })
  }
  speciality(event:any){
    // console.log('event.target.value');
    // console.log(event.target.value);
    // console.log(event.target.checked);
    if(event.target.checked == true){
      if(this.specialityarray.length==0){
        this.specialityarray = [];
        this.specialityarray.push(event.target.value);
      }else{
        this.specialityarray.push(event.target.value);
      }
    }
    if(event.target.checked == false){
      for( let i = 0; i < this.specialityarray.length; i++){
        if ( this.specialityarray[i] === event.target.value) {
          this.specialityarray.splice(i, 1);
          i--;
        }
      }
    }

    // console.log('this.specialityarray');
    // console.log(this.specialityarray);
    // console.log(this.dataForm.controls['doctor_details'].value);
    // // console.log(this.dataForm.controls['doctor_details'].['speciality'].value);
    // // console.log(this.dataForm.controls.doctor_details);
    // let usersArray = this.dataForm.controls.doctor_details as FormArray;
    // for(let i in usersArray){
    //   console.log('dgfgdhd');
    //   console.log(usersArray[i]['speciality'].value);
    //   console.log(usersArray[i].speciality);
    //   this.dataForm.controls['doctor_details'].value[i]['speciality'].setValue(this.specialityarray);
    // console.log(this.dataForm.controls.doctor_details[i].controls['speciality'].value);
    // }





  }

}
