import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AuthService } from "../../providers/auth-service/auth-service";
import { ServiveSingletonProvider } from "../../providers/servive-singleton/servive-singleton";
// import {
//   FileTransfer,
//   FileUploadOptions,
//   FileTransferObject
// } from "@ionic-native/file-transfer";
// import { File } from "@ionic-native/file";
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public photos: any;
  public base64Image: string;
  public fileImage: string;
  public responseData: any;
  userData = { user_id: "", token: "", imageB64: "" };
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    public authService: AuthService,
    public webServices: ServiveSingletonProvider
    //private transfer: FileTransfer, private file: File, private fileUploadOptions: FileUploadOptions
  ) {}
  //const fileTransfer = this.transfer.create();

  ngOnInit() {
    this.photos = [];
    console.log(this.webServices.BASE_URL);
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: "Sure you want to delete this photo? There is NO undo!",
      message: "",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Agree clicked");
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  takePhoto() {
    console.log("coming here");

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
        //this.sendData(imageData);
      },
      err => {
        console.log(err);
      }
    );
  }

  SaveImage(){
    if(this.photos){
      //this.webServices.presentAlert('Message',this.photos);
      let myKEyVals={ image1:this.photos[0],image2:this.photos[1],image3:this.photos[2],image4:this.photos[3],image5:this.photos[4]};
      this.webServices.saveImageData(myKEyVals).then(data=>{
        this.webServices.presentAlert('Response',data);
      })
    }
    else{
      this.webServices.presentAlert('Error','Please! take minimum 5 pics');
    }
  }


  sendData(imageData) {
    this.userData.imageB64 = imageData;
    this.userData.user_id = "1";
    this.userData.token = "222";
    console.log(this.userData);
    this.authService.postData(this.userData, "userImage").then(
      result => {
        this.responseData = result;
      },
      err => {
        // Error log
      }
    );
  }
}
