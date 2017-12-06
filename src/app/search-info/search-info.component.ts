import { Component, OnInit,ElementRef } from '@angular/core';
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
  isLoading:boolean = false;
  userDetailsInNetwork:any=[];
  searchInfo:boolean = true;
  constructor(private element: ElementRef,public fb: FormBuilder,private userInfo: UserInfoService,private addOrUpdate: AddUpdateStudentDetailsService) {
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
  });

  searchDetails(event){
    this.isLoading=true;
    console.log(this.searchForm.value)
    this.userInfo.queryDetailsFromNetwork(this.searchForm.controls.uniqueId.value).subscribe(res =>{
      if(res.length <= 0){
        alert("No records Found");
      }else{
        this.userDetailsInNetwork = res[0].Details;
        this.searching = false;
        console.log(this.userDetailsInNetwork);
        setTimeout(()=>{
          var image = this.element.nativeElement.querySelector('.image');
          image.src = this.userDetailsInNetwork.profilePic ;
        },500)
        this.searchInfo = false;
        this.isLoading=false;
      }
    })
  }
  search(){
    this.searching = true;
  }
  FormSearch(){
    this.userDetailsInNetwork = [];
    this.searchInfo = true;
    this.searching = true;
  }
}
