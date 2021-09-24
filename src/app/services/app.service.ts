import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


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

  public async generarPDF(datos: any) {
    const tipo = datos.tipo
    const folio = datos.folio
    const asunto = datos.asunto
    const administrador = datos.administrador
    const responsable = datos.responsable
    const telefono = datos.telefono
    const lugar = datos.lugar
    const items = this.getReporteObject()

    const logoSCOS = await this.getBase64ImageFromURL("../../assets/scos_logo.png")

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 80, 20, 70],
      /*background: (currentPage, pageSize) => {
        return { image: this.writeRotatedText("asdoahdsoashda"), width: 200, absolutePosition: { x: 50, y: 50 }, opacity: 0.1 }
      },*/
      header: {
        margin: 10,
        columns: [
          { image: logoSCOS, width: 120, margin: [35, 32, 10, 0] },
          {
            table: {
              widths: ["*"],
              body: [
                [{ text: "Seguridad electrónica", alignment: "right", bold: true }],
                [{ text: "Folio: 3", alignment: "right", bold: true, margin: [0, 0, 30, 0] }]
              ]
            },
            margin: [0, 32, 25, 0],
            layout: "noBorders"
          },

        ]
      },
      content: [
        {
          text: "Chihuahua, Chih; a " + this.oracionFecha(this.hoy()),
          margin: [0, 100, 0, 0],
          alignment: "right"
        },
        { text: "Administrador del reporte", margin: [0, 0, 0, 20] },
        { text: "Administrador del fracc. CD Juarez" },
        { text: "Asnto: Asunto del reporte" },
        { text: "Presente.-" },
        { text: "Por medio del presente informo los hallazgos encontrados en el CDJuarez" },
        { text: "Atentamente", alignment: "center", margin: [0, 100, 0, 0] },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1 }], margin: [0, 40, 0, 0], alignment: "center" },
        { text: "Responsable del reporte", alignment: "center" },
        { text: "Cel. telefono del responsable", alignment: "center" },

      ],
      footer: {
        columns: [
          {
            table: {
              widths: ["*"],
              body: [
                [{ canvas: [{ type: 'line', x1: 40, y1: 0, x2: 560, y2: 0, lineWidth: 1 }], alignment: "center" }],
                [{ text: "serviciosocs@hotmail.com", margin: [0, 0, 30, 0], alignment: "center" }],
              ]
            },
            margin: [0, 32, 25, 0],
            layout: "noBorders"
          },

        ]
      }
    }

    pdfMake.createPdf(docDefinition).open()
  }

  public writeRotatedText = text => {
    let ctx,
      canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 300;
    ctx = canvas.getContext('2d');
    ctx.font = '52pt Arial';
    ctx.save();
    ctx.translate(50, 300);
    ctx.rotate(-0.5 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fillText(text, 0, 0);
    ctx.restore();
    return canvas.toDataURL();
  };

  public getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  public hoy() {
    return new Date().toJSON().slice(0, 10);
  }

  public oracionFecha(date: string) {
    /*
        Arreglo de meses en español o en inglés. Usa la versión que necesites.
    */
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const yyyy = date.split("-")[0]
    const mm = Number(date.split("-")[1]) - 1
    let dd = date.split("-")[2]

    if (Number(dd) < 10) {
      dd = dd.substring(1)
    }

    return dd + " de " + meses[mm] + " del " + yyyy
    /*
        Si lo qusiéramos en inglés
        return months[mm] + " " + dd + "th " + yyyy 
    */
  }

  public getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
