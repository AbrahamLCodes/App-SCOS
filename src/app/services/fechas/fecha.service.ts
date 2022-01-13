import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  constructor() { }

  public hoy() {
    return new Date().toJSON().slice(0, 10);
  }

  public oracionFecha(date: string) {
    /*
        Arreglo de meses en español o en inglés. Usa la versión que necesites.
    */
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    //const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const yyyy = date.split("-")[0];
    const mm = Number(date.split("-")[1]) - 1;
    let dd = date.split("-")[2];

    if (Number(dd) < 10) {
      dd = dd.substring(1);
    }

    return dd + " de " + meses[mm] + " del " + yyyy;
    /*
        Si lo qusiéramos en inglés
        return months[mm] + " " + dd + "th " + yyyy 
    */
  }
}
