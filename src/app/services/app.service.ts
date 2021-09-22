import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  public async customToast(message: string, color: string){
    const toast = await this.toastController.create({
      message: message, 
      color: color,
      duration: 2000
    })
    toast.present()
  }

  public async messageToast(message: string){
    const toast = await this.toastController.create({
      message: message, 
      color: "primary",
      duration: 2000
    })
    toast.present()
  }

  public async warningToast(message: string) {
    console.log("Toasting ");
    
    const toast = await this.toastController.create({
      message: message, 
      color: "danger",
      duration: 2000
    })
    toast.present()
  }

  public async acceptMessage(header, message) {
    const messageAlert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
            {
                text: "Aceptar"
            }
        ]
    });
    messageAlert.present()
}
}
