import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loggedIn = false;
  login = true;
  notStudent = false;
  getWorkForm(){
    this.notStudent = !this.notStudent;
  }
  @Output() messageEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }
  enroll() {
    alert("enrolled");
    this.loggedIn=true;
    this.messageEvent.emit(this.loggedIn)
  }
}
