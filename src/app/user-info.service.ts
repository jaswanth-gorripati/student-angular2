import { Injectable } from '@angular/core';
import { HttpModule,Http,Headers,RequestOptions,Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserInfoService {
  userToken:any;
  userOrg:any;
  userName:any;
  adminUser:boolean;
  attr:any;
  constructor(private http:Http) { }
  setUser(user,name,org){
    this.userToken = user.token;
    this.userOrg = org;
    this.userName = name;
    this.adminUser = true;
    this.attr = user.attrs;
    /*if(name == 'admin'){
      this.adminUser = true;
    }*/
    console.log("Account Type:",this.attr.accountType);
  }
  isAdmin(){
    return true;
  }
  getAttrs(){
    return this.attr;
  }
  getUserToken(){
    return this.userToken;
  }
  AccountType(){
    return this.attr.accountType;
  }
  getUserName(){
    return this.userName;
  }
  enrollUSer(formdata){
    return this.http.post(' http://localhost:4000/users',formdata).map(res => res.json()) 
  }
  registerUser(formData){
    console.log(formData);
    return this.http.post(' http://localhost:4000/register',formData).map(res => res.json())
  }
  headers(){
    let headers = new Headers();
    headers.append('authorization','Bearer '+ this.userToken);
    headers.append('content-Type', 'application/json');
    
    var options = new RequestOptions({ headers: headers });
    return options;
  }
  getDashboardEdu(){
    let requestNetwork = {"channelName":"acadamics","chaincodeName":"rchain","version":"v0"}
    let formdata = {"fcn":"getallrequests","args":[]}
    return this.http.post(' http://localhost:4000/channels/'+requestNetwork.channelName+'/chaincodes/'+requestNetwork.chaincodeName+'',formdata,this.headers()).map(res => res.json());

  }
  getDashboardExp(){
    //let requestNetwork = {"channelName":"","chaincodeName":"rchain","version":"v0"}
    let formdata = {"fcn":"getdetailsbyattributes","args":['xyz']}
    return this.http.post(' http://localhost:4000/channels/profession/chaincodes/workchain',formdata,this.headers()).map(res => res.json());
  }
  registerToNetwork(formdata){
    let form = {"username":"admin","passkey":"adminpw","orgName":"org1"};
    console.log("got in registry :",formdata)
    this.enrollUSer(form).subscribe(res => { 
      let token = res.token;
      let headers = new Headers();
      headers.append('authorization','Bearer '+token);
      headers.append('content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      this.http.post('http://localhost:4000/channels/mainchannel/chaincodes/getchaininfo',formdata,options).subscribe(res =>{
        console.log(res);
      })
    });
  }
  getUserDetailsFromNetwork(){
    let formdata = {"fcn":"getPersonalInfo","args":[]}
    return this.http.post('http://localhost:4000/channels/mainchannel/chaincodes/getchaininfo',formdata,this.headers()).map(res => res.json());
  }
  
}
