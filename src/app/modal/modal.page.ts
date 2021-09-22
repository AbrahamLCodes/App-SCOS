import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @ViewChild('slider', { read: IonSlides }) slider: IonSlides;

  public tamano = {
    initialSlide: 0,
    speed: 300,
    mode: 'ios',
    slidesPerView: "auto",
    autoplay: false,
    allowTouchMove: true
  };

  public files: File[] = [];

  constructor(
    public modalController: ModalController,
    public appService: AppService
  ) { }

  ngOnInit() {
  }

  public cerrar(tipo) {
    if (tipo == "modal") {
      this.modalController.dismiss({
        'dismissed': true
      });
    }
  }
  
  onSelect(event) {
    if(this.files.length + 1 == 3){
      this.appService.acceptMessage("Aviso", "Solo puedes cargar 2 imagenes")
    } else {
      this.files.push(...event.addedFiles);
    }
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
