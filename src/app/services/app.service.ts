import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  REPORTES_NAME = "itemsSCOS"

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  public submitReporte(item: any) {
    if (!sessionStorage.getItem(this.REPORTES_NAME)) {
      sessionStorage.setItem(this.REPORTES_NAME, JSON.stringify([]))
    }

    let items = this.getReporteObject()
    items.push(item)
        
    sessionStorage.setItem(this.REPORTES_NAME, JSON.stringify(items))
  }

  public updateReporte(item: any, index: number) {
    let items = this.getReporteObject()
    items[index] = item
    sessionStorage.setItem(this.REPORTES_NAME, JSON.stringify(items))
  }

  public deleteReporte(index: number) {
    let items = this.getReporteObject()
    items.splice(index, 1)
    sessionStorage.setItem(this.REPORTES_NAME, JSON.stringify(items))
  }

  public getReporteObject() {
    return JSON.parse(sessionStorage.getItem(this.REPORTES_NAME))
  }

  public async customToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000
    })
    toast.present()
  }

  public async messageToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: "primary",
      duration: 2000
    })
    toast.present()
  }

  public async warningToast(message: string) {
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
