import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonSlides, ModalController, NavParams } from '@ionic/angular';
import Item from '../modelos/item';
import { OutputService } from '../services/output/output.service';
import { ReporteService } from '../services/reporte/reporte.service';

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
  public items: Item[] = []

  constructor(
    fb: FormBuilder,
    public modalController: ModalController,
    private navParams: NavParams,
    private reporte: ReporteService,
    private output: OutputService,
    private alertController: AlertController
  ) {
    this.form = fb.group({
      asunto: ["", Validators.required],
      descripcion: ["", Validators.required]
    });
  }

  public ngOnInit(): void {
    this.editar = this.navParams.get("editar");
    this.indexAEditar = this.navParams.get("index");
    this.items = this.reporte.getReporteObject();

    if (this.editar) {
      this.form.patchValue({
        asunto: this.items[this.indexAEditar].asunto,
        descripcion: this.items[this.indexAEditar].descripcion
      });

      Promise.all(this.items[this.indexAEditar].base64Images.map(async base64Image => {
        this.urltoFile(base64Image, "imagen", "image/jpg").then(file => {
          this.files.push(file);
        });
      }));
    }
  }

  public async submitItem(): Promise<any> {
    const base64Array = [];
    await Promise.all(this.files.map(async file => {
      const base64Image = await this.getBase64(file);
      base64Array.push(base64Image);
    })).then(result => {
      if (this.editar) {
        this.reporte.updateReporte({
          asunto: this.form.value.asunto,
          descripcion: this.form.value.descripcion,
          base64Images: base64Array
        }, this.indexAEditar);
      } else {
        this.reporte.submitReporte({
          asunto: this.form.value.asunto,
          descripcion: this.form.value.descripcion,
          base64Images: base64Array
        });
      }

      this.cerrar()
    })
  }

  public cerrar(): void {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  public getBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  private urltoFile(url, filename, mimeType): Promise<File> {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

  public async ngxClicked(event): Promise<any> {
    if(this.files.length < 1){
      this.onSelect(event);
    } else {
      const alerter = await this.alertController.create({
        header: "Elige la operación",
        inputs: [
          {
            type: "radio",
            label: "Reemplazar",
            name: "reemplazar",
            value: "reemplazar"
          },
          {
            type: "radio",
            label: "Agregar",
            name: "agregar",
            value: "agregar"
          }
        ],
        buttons: [
          {
            text: "Cancelar"
          },
          {
            text: "Aceptar",
            handler: data => {
              if(data == "reemplazar") {
                this.files.pop();
                this.onSelect(event);
              } else {
                this.onSelect(event);
              }
            }
          }
        ]
      })
      alerter.present();
    }
  }

  public onSelect(event): void {
    if (this.files.length + 1 == 3) {
      this.output.acceptMessage("Aviso", "Solo puedes cargar 2 imagenes");
    } else {
      this.files.push(...event.addedFiles);
    }
  }

  public removeFileAtIndex(index): void {
    this.files.splice(index, 1);
  }

  public eliminar(){
    if (this.files.length > 0 ) {
      this.files.pop();
    }
  }

  public onRemove(event): void {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
