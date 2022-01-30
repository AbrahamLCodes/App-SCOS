import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { MultimediaService } from '../multimedia/multimedia.service';
import { ReporteService } from '../reporte/reporte.service';
import { FechaService } from '../fechas/fecha.service';
import { SpinnerService } from '../spinner/spinner.service';
import { alertController } from '@ionic/core';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(
    private multimedia: MultimediaService,
    private reporte: ReporteService,
    private fechas: FechaService,
    private fileOpener: FileOpener,
    private spinner: SpinnerService
  ) { }

  public construirRenglones() {
    const items = this.reporte.getReporteObject();
    const rows = [];
    items.forEach(item => {
      const imagenesArray = [];
      item.base64Images.map(imagen64 => {
        imagenesArray.push([{ image: imagen64, width: 120, margin: [40, 10, 10, 0] }])
      });
      rows.push(
        [
          {
            table: {
              body: [
                [{ text: item.asunto, alignment: "left", bold: true }],
                [{ text: item.descripcion, alignment: "justify", bold: false }]
              ]
            },
            margin: [0, 20, 0, 0],
            layout: "noBorders"
          },
          {
            table: {
              body: imagenesArray
            },
            margin: [0, 20, 0, 0],
            layout: "noBorders"
          }
        ]
      );
      rows.push(
        [
          { canvas: [{ type: 'line', x1: 20, y1: 0, x2: 520, y2: 0, lineWidth: 1 }] },
          {}
        ]
      );
    })

    const contentTable = {
      table: {
        body: rows,
        widths: [300, 200]
      },
      layout: "noBorders"
    }

    return contentTable;
  }

  public async generarPDF(datos: any) {
    this.spinner.show();
    const folio = datos.folio;
    const asunto = datos.asunto;
    const administrador = datos.administrador;
    const responsable = datos.responsable;
    const telefono = datos.telefono;
    const lugar = datos.lugar;

    const logoSCOS = await this.multimedia.getBase64ImageFromURL("../../assets/scos_logo.png");
    const logoSCOSRotated = await this.multimedia.getBase64ImageFromURL("../../assets/scos_rotated.png");

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 130, 20, 70],
      background: (currentPage, pageSize) => {
        return { image: logoSCOSRotated, width: 300, opacity: 0.1, absolutePosition: { x: 150, y: 370 } }
      },
      header: {
        margin: 10,
        columns: [
          { image: logoSCOS, width: 120, margin: [35, 32, 10, 20] },
          {
            table: {
              widths: ["*"],
              body: [
                [{ text: "Seguridad electrónica", alignment: "right", bold: true }],
                [{ text: "Folio: " + folio, alignment: "right", bold: true, margin: [0, 0, 30, 0] }]
              ]
            },
            margin: [0, 32, 25, 0],
            layout: "noBorders"
          },
        ]
      },
      content: [
        {
          text: "Chihuahua, Chih; a " + this.fechas.oracionFecha(this.fechas.hoy()),
          margin: [0, 100, 0, 0],
          alignment: "right"
        },
        { text: administrador, margin: [0, 0, 0, 20] },
        { text: "Administrador de " + lugar },
        { text: "Asunto: " + asunto },
        { text: "Presente.-" },
        { text: "Por medio del presente informo los hallazgos encontrados en " + lugar },
        { canvas: [{ type: 'line', x1: 40, y1: 0, x2: 560, y2: 0, dash: { length: 1, space: 5 }, lineWidth: 1 }], margin: [0, 40, 0, 0], alignment: "center" },
        this.construirRenglones(),
        { text: "Atentamente", absolutePosition: { y: 690 }, alignment: "center", margin: [0, 100, 0, 0] },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1 }], absolutePosition: { y: 735 }, margin: [0, 40, 0, 0], alignment: "center" },
        { text: responsable, alignment: "center", absolutePosition: { y: 740 } },
        { text: telefono, alignment: "center", absolutePosition: { y: 755 } },
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

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-');
    await pdfDocGenerator.getBase64(async data => {
      try {
        let path = `reporte${currentDate}.pdf`
        const result = await Filesystem.writeFile({
          path,
          data,
          directory: Directory.Documents,
          recursive: true
        })
        this.fileOpener.open(`${result.uri}`, 'application/pdf')
      } catch (e) {
        const alerter = await alertController.create({
          header: "Error al generar PDF",
          message: e
        });
        alerter.present();
      }
    })
    this.spinner.hide();
  }

  public writeRotatedImage = imagen => {
    let ctx: CanvasRenderingContext2D, canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 300;
    ctx = canvas.getContext('2d');
    ctx.font = '52pt Arial';
    ctx.save();
    ctx.translate(50, 300);
    ctx.rotate(-0.5 * Math.PI);
    ctx.fillStyle = '#000';

    let image = new Image()
    image.src = imagen
    new Promise((resolve, reject) => {
      image.onload = () => {
        ctx.drawImage(image, 50, 50)
        console.log("Dibujando imagen");
      }
    })

    ctx.restore()
    return canvas.toDataURL();
  };

}
