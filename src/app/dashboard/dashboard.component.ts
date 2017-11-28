import { Component, OnInit ,ElementRef} from '@angular/core';
import { UserInfoService } from "../user-info.service";
import { AddUpdateStudentDetailsService } from "../add-update-student-details.service";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  details:any;
  constructor(private userInfo: UserInfoService,private element: ElementRef,private addUpdateService: AddUpdateStudentDetailsService) { }
  public form = [true,false,false];
  user:any = [];
  accounType:any;
  userRequests:any =[];
  profilePic:any;
  ngOnInit() {
    this.details = {'name':'VIGNAN','dob':'JNTU','age':'Hyderabad','father':'Admin',
                    'education':[
                      {'degree':'12uq1a0434','board':'Add Request','score':98,'clgName':'little','clgCode':'2013'},
                      {'degree':'13uq1a0987','board':'Add Request','score':93,'clgName':'chaitanya','clgCode':'2015'},
                      {'degree':'13uy45y654','board':'Update Request','score':87,'clgName':'vignan','clgCode':'2016'},
                      {'degree':'12uq1a0yu4','board':'Add Request','score':98,'clgName':'little','clgCode':'2013'},
                      {'degree':'15uqhgft87','board':'Update Request','score':93,'clgName':'chaitanya','clgCode':'2014'},
                      {'degree':'1yuy45y654','board':'Update Request','score':87,'clgName':'vignan','clgCode':'2000'}
                  ]}
    this.userRequests = {"pending":[],"approved":[],"rejected":[]}
    let token = this.userInfo.getUserToken();
    this.addUpdateService.setToken(token);
    this.accounType = this.userInfo.AccountType();
    this.user = this.userInfo.getAttrs();
    this.user.name = this.userInfo.getUserName();
    this.userContent();
  }
  userContent(){
    if(this.user.name != 'admin'){
      this.userInfo.getDashboard().subscribe(res=>{
        console.log("USer Requests : ",res)
        for(let i=0;i<res.length;i++){
          if(res[i].Details.status == "pending"){
            this.userRequests.pending.push(res[i].Details);
          }else if(res[i].Details.status == "Approve"){
            this.userRequests.approved.push(res[i].Details);
          }else if(res[i].Details.status == "rejected"){
            this.userRequests.rejected.push(res[i].Details);
          }
        }
        console.log("userREquests : ",this.userRequests )
      })
      this.userInfo.getUserDetailsFromNetwork().subscribe(res =>{
        console.log(res);
        this.user.profilePic = res[0].Details.profilePic;
        var image = this.element.nativeElement.querySelector('.image');
        image.src = this.user.profilePic ;
      })
    } 
  }
  changeForm(index){
    this.form[index] = true;
    for(let i=0;i<3;i++){
      if(i != index){
        this.form[i] = false;
      }
    }
  }
  approve(index){
    let formdata = {"fcn":"hypernymprocess","args":[this.userRequests.pending[index].studentId,this.userRequests.pending[index].degree,"Approve",this.userRequests.pending[index].remarks,this.userRequests.pending[index].board,this.userRequests.pending[index].clgname,""+this.userRequests.pending[index].yop+"",""+this.userRequests.pending[index].Percentage+""]}
    console.log(this.userRequests.pending[index]);
    this.addUpdateService.addDetailsToMain(formdata);
    setTimeout(function() {
      this.addUpdateService.getAlert().then(res=>{
        if(res == "approved"){
          this.userContent()  
        }else{
          alert(res);
        }
      })
    }, 1000);
  }
  reject(index){
    let formdata = {"fcn":"hypernymprocess","args":[this.userRequests.pending[index].studentId,this.userRequests.pending[index].degree,"rejected","Does not Match Our database"]}
    console.log(this.userRequests.pending[index]);
    this.addUpdateService.addDetails(formdata).subscribe(res=>{
      if(res == ""){
        alert("rejected")
      }else{
        alert("failed to reject");
      }
    })
  }
}
