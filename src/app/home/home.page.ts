import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SplashScreen } from '@capacitor/splash-screen';
import { ModalController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { ModalPage } from '../modal/modal.page';
import { AppService } from '../services/app.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public form: FormGroup
  public items: any = []

  constructor(
    fb: FormBuilder,
    private modalController: ModalController,
    private appService: AppService,
    private sanitizer: DomSanitizer
  ) {
    this.form = fb.group({
      tipo: [null, Validators.required],
      folio: [null, Validators.required],
      asunto: [null, Validators.required],
      administrador: [null, Validators.required],
      responsable: [null, Validators.required],
      telefonoResponsable: [null, Validators.required],
      lugar: [null, Validators.required]
    })
  }

  public ngOnInit() {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });
  }

  public ionViewDidEnter() {
    this.cargarItems()
  }

  private cargarItems(){
    this.items = this.appService.getReporteObject()
  }

  public async clickItem(index: number) {
    const alert = await alertController.create({
      header: "¿Qué deseas hacer con el item?",
      inputs: [
        {
          label: "Eliminar",
          type: "radio",
          value: "ELIMINAR"
        },
        {
          label: "Editar",
          type: "radio",
          value: "EDITAR"
        }
      ],
      buttons: [
        {
          text: "Cancelar"
        },
        {
          text: "Aceptar",
          handler: data => {
            if(data ==  "ELIMINAR"){
              this.appService.deleteReporte(index)
              this.cargarItems()
            } else {
              this.openModal(true, index)
            }
          }
        }
      ]
    })
    alert.present()
  }

  public async openModal(editar: boolean, index: number) {
    let falla = false
    if (this.form.value.tipo == 'FALLA') {
      falla = true
    }
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        falla: falla,
        editar: editar,
        index: index
      }
    });
    modal.onDidDismiss().then(_ => {
      this.cargarItems()
    })

    return await modal.present();
  }

}
