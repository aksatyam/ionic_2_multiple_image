//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Events, AlertController, LoadingController,ToastController } from "ionic-angular";
import 'rxjs/add/operator/map';

@Injectable()
export class ServiveSingletonProvider {
  public BASE_URL: string = "http://192.168.43.162/ionic2/";
  public alert:any;
  public toast:any;
  public loading:any;
  public data:any;
  public headers:any={'Content-Type': 'application/json'};
  constructor(  public http: Http,
                public toastCtrl: ToastController,
                public loadingCtrl:LoadingController,
                public alertCtrl:AlertController,
                public events:Events) {
        
                  console.log('Hello ServiveSingletonProvider Provider');
 
  }

  //GET-POST Method Call Functions 
  getData(u) {
    return new Promise(resolve=>{
      this.http.get(u,{headers:new Headers(this.headers)})
        .map(res=>res.json())
        .subscribe(data=>{
        this.data=data;
        resolve(this.data)
      },err=>{
          console.log(JSON.stringify(err));
          var errord=JSON.parse(err['_body']);
          if(errord){
            this.presentToast(errord['message']);
          }
          else{
            console.log("error Occured");
            this.presentToast("Please Check Internet Connection or Try Again Later!");
          }
          resolve(false);
      })
    })
  }

  postData(u,data){
    return new Promise(resolve => {
      this.http.post(u,data,{headers:new Headers(this.headers)})
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        },err=>{
          var errord=JSON.parse(err['_body']);
          if(errord){
            this.presentToast(errord['message']);
          }
          else{
            console.log("error Occured");
            this.presentToast("Please Check Internet Connection or Try Again Later!");
          }
          resolve(false);
        });
    });
  }

  //GENERAL FUNCTION IN THE APPLICATION

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'OK',
      dismissOnPageChange: false
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  presentLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
  stopLoading(){
    this.loading.dismissAll();
  }

  presentAlert(mainTitle,subTitle) {
    let alert = this.alertCtrl.create({
      title: mainTitle,
      subTitle: subTitle,
      buttons: [{
        text:'OK',
      }],
      cssClass:'alertcss'
    });
    alert.present();
  }

  saveImageData(myKeyVals){
    var u=this.BASE_URL+"saveImage.php";
    console.log(u);
    console.log(myKeyVals);
    return this.postData(u,myKeyVals);
  }
  
}
