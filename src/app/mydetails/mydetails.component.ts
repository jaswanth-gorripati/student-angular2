import { Component, OnInit ,ElementRef } from '@angular/core';
import { UserInfoService } from "../user-info.service";


@Component({
  selector: 'app-mydetails',
  templateUrl: './mydetails.component.html',
  styleUrls: ['./mydetails.component.css']
})
export class MydetailsComponent implements OnInit {

  userDetailsInNetwork:any
  username:any
  isLoading:boolean = true;
  constructor(private userInfo:UserInfoService,private element: ElementRef) { }

  ngOnInit() {

    this.userInfo.getUserDetailsFromNetwork().subscribe(res =>{
      console.log(res);
      this.userDetailsInNetwork = res[0].Details;
      console.log("userDetails:",this.userDetailsInNetwork);
      this.username=this.userDetailsInNetwork.username;
      this.isLoading = false;
      var image = this.element.nativeElement.querySelector('.image');
      image.src = this.userDetailsInNetwork.profilePic ;
    })
  }
}
