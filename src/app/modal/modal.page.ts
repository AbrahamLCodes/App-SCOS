import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
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
  public form: FormGroup

  public editar = false
  public indexAEditar = 0
  public items: any = []

  constructor(
    public modalController: ModalController,
    public appService: AppService,
    private fb: FormBuilder,
    private navParams: NavParams
  ) {
    this.form = fb.group({
      asunto: ["", Validators.required],
      descripcion: ["", Validators.required]
    })
  }

  ngOnInit() {
    this.editar = this.navParams.get("editar")
    this.indexAEditar = this.navParams.get("index")
    this.items = this.appService.getReporteObject()

    if (this.editar) {
      this.form.patchValue({
        asunto: this.items[this.indexAEditar].asunto,
        descripcion: this.items[this.indexAEditar].descripcion
      })

      Promise.all(this.items[this.indexAEditar].base64Images.map(async base64Image => {
        this.urltoFile(base64Image, "imagen", "image/jpg").then(file => {
          this.files.push(file)
        })
      }))
    }
  }

  public async submitItem() {
    const base64Array = []
    await Promise.all(this.files.map(async file => {
      const base64Image = await this.getBase64(file)
      base64Array.push(base64Image)
    })).then(result => {
      if(this.editar){
        this.appService.updateReporte({
          asunto: this.form.value.asunto,
          descripcion: this.form.value.descripcion,
          base64Images: base64Array
        }, this.indexAEditar)
      } else {
        this.appService.submitReporte({
          asunto: this.form.value.asunto,
          descripcion: this.form.value.descripcion,
          base64Images: base64Array
        })
      }
      
      this.cerrar()
    })
  }

  public cerrar() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  public getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  private urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

  onSelect(event) {
    if (this.files.length + 1 == 3) {
      this.appService.acceptMessage("Aviso", "Solo puedes cargar 2 imagenes")
    } else {
      this.files.push(...event.addedFiles);
    }
  }

  public removeFileAtIndex(index){
    this.files.splice(index, 1)
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
