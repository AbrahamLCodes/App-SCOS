import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SplashScreen } from '@capacitor/splash-screen';
import { ModalController } from '@ionic/angular';
import { ModalItemComponent } from '../modal-item/modal-item.component';

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
    private modalController: ModalController
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
    console.log("Mostrando Splash Screen");
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });
  }

  public async openModal(){
    let falla = false 
    if(this.form.value.tipo == 'FALLA'){
      falla = true
    }
    const modal = await this.modalController.create({
      component: ModalItemComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        falla: falla
      }
    });
    modal.onDidDismiss().then(dismissData => {
      const data = dismissData.data
      console.log(data);
    })

    return await modal.present();
  }

}
