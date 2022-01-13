import { Injectable } from '@angular/core';
import Item from 'src/app/modelos/item';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  public REPORTE_NAME = "SCOS_REPORTE"

  constructor() { }

  public submitReporte(item: any): void {
    if (!sessionStorage.getItem(this.REPORTE_NAME)) {
      sessionStorage.setItem(this.REPORTE_NAME, JSON.stringify([]));
    }

    let items: Item[] = this.getReporteObject();
    items.push(item);

    sessionStorage.setItem(this.REPORTE_NAME, JSON.stringify(items));
  }

  public updateReporte(item: Item, index: number) {
    let items = this.getReporteObject();
    items[index] = item;
    sessionStorage.setItem(this.REPORTE_NAME, JSON.stringify(items));
  }

  public deleteReporte(index: number) {
    let items = this.getReporteObject();
    items.splice(index, 1);
    sessionStorage.setItem(this.REPORTE_NAME, JSON.stringify(items));
  }

  public getReporteObject(): Item[] {
    return JSON.parse(sessionStorage.getItem(this.REPORTE_NAME));
  }
}
