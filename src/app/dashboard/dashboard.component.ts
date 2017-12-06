import { Component, OnInit ,ElementRef} from '@angular/core';
import { UserInfoService } from "../user-info.service";
import { Router } from "@angular/router";
import { AddUpdateStudentDetailsService } from "../add-update-student-details.service";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  details:any;
  constructor(private router: Router,private userInfo: UserInfoService,private element: ElementRef,private addUpdateService: AddUpdateStudentDetailsService) { }
  public form = [true,false,false];
  user:any = [];
  accounType:any;
  userRequests:any =[];
  profilePic:any;
  isLoading = true;
  ngOnInit() {
    this.userRequests = {"education":{"pending":[],"approved":[],"rejected":[]},"experience":{"pending":[],"approved":[],"rejected":[]}}
    let token = this.userInfo.getUserToken();
    this.addUpdateService.setToken(token);
    this.accounType = this.userInfo.AccountType();
    this.user = this.userInfo.getAttrs();
    this.user.name = this.userInfo.getUserName();
    this.userContent();
  }
  userContent(){
    if(this.accounType == 'student' || this.accounType == 'employee' || this.accounType == 'universityStaff'){
      this.userInfo.getDashboardEdu().subscribe(res=>{
        console.log("User Edu Requests : ",res)
        console.log(res.length)
          for(let i=0;i<res.length;i++){
            if(res[i].Details.status == "pending"){
              this.userRequests.education.pending.push(res[i].Details);
            }else if(res[i].Details.status == "Approve"){
              this.userRequests.education.approved.push(res[i].Details);
            }else if(res[i].Details.status == "rejected"){
              this.userRequests.education.rejected.push(res[i].Details);
            }
            console.log("userREquests : ",this.userRequests )
          }
          console.log("userREquests : ",this.userRequests )
          this.isLoading = false;
      })
    }
    if(this.accounType == 'employee' || this.accounType =='employer'){
      this.userInfo.getDashboardExp().subscribe(res=>{
        console.log("User Exp Requests : ",res)
        if(res != []){
          for(let i=0;i<res.length;i++){
            if(res[i].Record.status == "pending"){
              this.userRequests.experience.pending.push(res[i].Record);
            }else if(res[i].Record.status == "Approve"){
              this.userRequests.experience.approved.push(res[i].Record);
            }else if(res[i].Record.status == "Rejected"){
              this.userRequests.experience.rejected.push(res[i].Record);
            }
          }
          console.log("userREquests : ",this.userRequests)
          this.isLoading = false;
        }
      })
    }
    if(this.accounType == "student" || this.accounType == 'employee'){
      this.userInfo.getUserDetailsFromNetwork().subscribe(res =>{
        console.log(res);
        this.user.profilePic = res[0].Details.profilePic;
        var image = this.element.nativeElement.querySelector('.image');
        image.src = this.user.profilePic ;
      })
    } 
  }
  navToDetails(){
    this.router.navigate(["/mydetails"]);
  }
  changeForm(index){
    this.form[index] = true;
    for(let i=0;i<3;i++){
      if(i != index){
        this.form[i] = false;
      }
    }
  }
  forEE(){
    if(this.accounType == "employer" || this.accounType=="employee"){
      return true;
    }else{
      return false;
    }
  }
  forSE(){
    if(this.accounType == "student" || this.accounType=="employee"){
      return false;
    }else{
      return true;
    }
  }
  adminRightsInfo(){
    if(this.accounType == 'student' || this.accounType == 'employee'){
      return false;
    }else{
      return true;
    }
  }
  approve(index){
    let formdata = {"fcn":"hypernymprocess","args":[this.userRequests.education.pending[index].studentId,this.userRequests.education.pending[index].degree,"Approve",this.userRequests.education.pending[index].remarks,this.userRequests.education.pending[index].board,this.userRequests.education.pending[index].clgname,""+this.userRequests.education.pending[index].yop+"",""+this.userRequests.education.pending[index].Percentage+"",this.userRequests.education.pending[index].RequestType]}
    console.log(this.userRequests.education.pending[index]);
    this.addUpdateService.addDetailsToMain(formdata);
    setTimeout(function() {
      this.addUpdateService.getAlert().then(res=>{
        if(res == "approved"){
          this.userContent()  
        }else{
          alert(res);
        }
        this.OnInit();
      })
    }, 2000);
  }
  reject(index){
    let formdata = {"fcn":"hypernymprocess","args":[this.userRequests.education.pending[index].studentId,this.userRequests.education.pending[index].degree,"rejected","Does not Match Our database"]}
    console.log(this.userRequests.education.pending[index]);
    this.addUpdateService.addDetails(formdata).subscribe(res=>{
      if(res == ""){
        alert("rejected")
      }else{
        alert("failed to reject");
      }
    })
  }
  approveWork(index){
    let formdata = {"fcn":"hypernymprocess","args":[this.userRequests.experience.pending[index].employeeId,this.userRequests.experience.pending[index].companyname,"Approve",this.userRequests.experience.pending[index].remarks,this.userRequests.experience.pending[index].designation,this.userRequests.experience.pending[index].location,this.userRequests.experience.pending[index].yoj,this.userRequests.experience.pending[index].dor,""+this.userRequests.experience.pending[index].experience+"",""+this.userRequests.experience.pending[index].working+"",this.userRequests.experience.pending[index].RequestType]}
    console.log(formdata);
    this.addUpdateService.addWorkDetailsToMain(formdata);
    setTimeout(function() {
      this.addUpdateService.getAlert().then(res=>{
        if(res == "approved"){
          this.userContent()  
        }else{
          alert(res);
        }
      })
    }, 2000);
  }
  rejectWork(index){
    let formdata = {"fcn":"hypernymprocess","args":[this.userRequests.experience.pending[index].employeeId,this.userRequests.experience.pending[index].companyname,"Rejected","Does not Match Our database"]}
    console.log(this.userRequests.education.pending[index]);
    this.addUpdateService.addWorkDetails(formdata).subscribe(res=>{
      if(res == ""){
        alert("rejected")
      }else{
        alert("failed to reject");
      }
    })
  }
}
