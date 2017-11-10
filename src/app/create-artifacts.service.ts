import { Injectable } from '@angular/core';
import { HttpModule,Http,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserInfoService } from "./user-info.service";

@Injectable()
export class CreateArtifactsService {
  token:any;
  constructor(private http:Http,private userInfo: UserInfoService) {
   }
  setToken(token){
    this.token = token;
    console.log(this.token);
  }
  headers(){
    let headers = new Headers();
    headers.append('authorization','Bearer '+ this.token);
    headers.append('content-Type', 'application/json');
    
    var options = new RequestOptions({ headers: headers });
    return options;
  }
  
  createChannel(formData,token){
    return this.http.post('http://localhost:4000/channels',formData,this.headers()).map(res => res.json())
  }
  joinChannel(channelName,peers){
    return this.http.post('http://localhost:4000/channels/'+channelName+'/peers',peers,this.headers()).map(res => res.json());
  }
  installChaincode(formdata){
    return this.http.post('http://localhost:4000/chaincodes',formdata,this.headers()).map(res => res);
  }
  instantiateChaincode(formdata){
    return this.http.post('http://localhost:4000/channels/'+formdata.channelName+'/chaincodes',formdata,this.headers()).map(res => res);
  }
  getChannelInfo(channelName){
    return this.http.get('http://localhost:4000/channels/'+channelName+'',this.headers()).map(res => res.json());
  }
  chaincodeInfo(peer,type){
    return this.http.get('http://localhost:4000/chaincodes?peer='+peer+'&&type='+type+'',this.headers()).map(res => res.text());
  }
  getChannels(formdata){
    return this.http.get('http://localhost:4000/channels?peer='+formdata+'',this.headers()).map(res => res.json());
  }
}
