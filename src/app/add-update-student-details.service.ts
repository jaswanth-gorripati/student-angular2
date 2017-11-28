import { Injectable } from '@angular/core';
import { HttpModule,Http,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AddUpdateStudentDetailsService {
  requestNetwork = {"channelName":"acadamics","chaincodeName":"rchain","version":"v1"}
  token:any;
  constructor(private http:Http) { }
  setToken(token){
    this.token = token;
  }
  getToken(){
    return this.token;
  }
  headers(){
    let headers = new Headers();
    headers.append('authorization','Bearer '+ this.token);
    headers.append('content-Type', 'application/json');
    
    var options = new RequestOptions({ headers: headers });
    return options;
  }
  isStudentExists(network,form){
    return this.http.post(' http://localhost:4000/channels/'+network.channelName+'/chaincodes/'+network.chaincodeName+'',form,this.headers()).map(res => res.json())
  }
  addDetails(formdata){
    return this.http.post(' http://localhost:4000/channels/'+this.requestNetwork.channelName+'/chaincodes/'+this.requestNetwork.chaincodeName+'',formdata,this.headers()).map(res => res.text())
  }
  alert:any;
  addDetailsToMain(formdata){
    let rChainData = {"fcn":"hypernymprocess","args":[formdata.args[0],formdata.args[1],formdata.args[2],formdata.args[3]]}
    this.http.post(' http://localhost:4000/channels/'+this.requestNetwork.channelName+'/chaincodes/'+this.requestNetwork.chaincodeName+'',rChainData,this.headers()).subscribe(res => {
      console.log(res.text())
      if(res.text() === ""){
        let mainData = {"fcn":"addEducation","args":[formdata.args[0],formdata.args[1],formdata.args[4],formdata.args[5],formdata.args[6],formdata.args[7]]}
        this.http.post(' http://localhost:4000/channels/mainchannel/chaincodes/getinfochain2',mainData,this.headers()).subscribe(res =>{
          console.log("From main add",res.text())
          if(res.text() == ""){
            alert("Approved");
            this.alert = "approved";
          }else{
            this.alert = "failed";
          }
        })
      }
    })
  }
  getAlert(){
    return this.alert;
  }
}
