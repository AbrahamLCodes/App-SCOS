import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public form: FormGroup
  public items: any = []

  constructor(
    fb: FormBuilder
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

  ngOnInit() {
    console.log("Mostrando Splash Screen");
    
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });
  }

}
