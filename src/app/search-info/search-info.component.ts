import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder,FormControl,FormArray, Validators } from '@angular/forms';
import { UserInfoService } from "../user-info.service";
import { AddUpdateStudentDetailsService } from "../add-update-student-details.service";

@Component({
  selector: 'search-info',
  templateUrl: './search-info.component.html',
  styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements OnInit {

  token:any;
  userName:any;
  searching = true;
  constructor(public fb: FormBuilder,private userInfo: UserInfoService,private addOrUpdate: AddUpdateStudentDetailsService) {
    this.token = this.userInfo.getUserToken();
    console.log(this.token);
    this.addOrUpdate.setToken(this.token);
    this.userName = this.userInfo.getUserName();
    this.userName = this.userName.toUpperCase();
   }


  ngOnInit() { }
  studentDetails = {};
  public searchForm = this.fb.group({
    uniqueId:["1",Validators.required],
    channelName:["mychannel",Validators.required],
    chaincodeName:["mycc",Validators.required],
    chaincodeVersion:["v0",Validators.required],
    peer1:["true",Validators.required],
    peer2:["true",Validators.required],
    peers:[[],Validators.required],
  });

  setPeers(){
    if(this.searchForm.controls.peer1.value == true && this.searchForm.controls.peer2.value != true  ){
      this.searchForm.controls['peers'].setValue(['peer1']);
    }else if(this.searchForm.controls.peer2.value == true  && this.searchForm.controls.peer1.value != true ){
      this.searchForm.controls['peers'].setValue(['peer2']);
    }else if(this.searchForm.controls.peer1.value == true && this.searchForm.controls.peer2.value == true  ){
      this.searchForm.controls['peers'].setValue(['peer1','peer2']);
    }
  }
  searchDetails(event){
    this.setPeers();
    console.log(this.searchForm.value)
    let form = {"fcn":"getHistory","args":[""+this.searchForm.controls.uniqueId.value+""]}
    this.addOrUpdate.isStudentExists(this.searchForm.value,form).subscribe(res =>{
      if(res.length <= 0){
        alert("No records Found");
      }else{
        this.studentDetails = res[res.length-1].StudentDetails;
        console.log(this.studentDetails);
        this.searching = false;
      }
    })
  }
  search(){
    this.searching = true;
  }
}
