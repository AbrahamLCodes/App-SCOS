import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SplashScreen } from '@capacitor/splash-screen';
import { ModalController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { ModalPage } from '../modal/modal.page';
import Item from '../modelos/item';
import { PdfService } from '../services/pdf/pdf.service';
import { ReporteService } from '../services/reporte/reporte.service';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public form: FormGroup
  public items: Item[] = []

  constructor(
    fb: FormBuilder,
    private modalController: ModalController,
    private reporte: ReporteService,
    private pdf: PdfService,
    private sanitizer: DomSanitizer,
    //private androidPermissions: AndroidPermissions
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

  public ngOnInit(): void {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });
  }

  public ionViewDidEnter(): void {
    this.cargarItems();
    /*this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
    
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);*/
  }

  public cargarItems(): void {
    const its: Item[] = this.reporte.getReporteObject();
    if (its != null || its != undefined) {
      this.items = this.reporte.getReporteObject();
    }
  }

  public generarPDF(): void {
    this.pdf.generarPDF(this.form.value);
  }

  public async clickItem(index: number): Promise<any> {
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
            if (data == "ELIMINAR") {
              this.reporte.deleteReporte(index);
              this.cargarItems();
            } else {
              this.openModal(true, index);
            }
          }
        }
      ]
    })
    alert.present();
  }

  public async openModal(editar: boolean, index: number): Promise<any> {
    let falla = false;
    if (this.form.value.tipo == 'FALLA') {
      falla = true;
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
      this.cargarItems();
    });

    return await modal.present();
  }

}
