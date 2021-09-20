import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-item',
  templateUrl: './modal-item.component.html',
  styleUrls: ['./modal-item.component.scss'],
})
export class ModalItemComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    
  }

  dismissController(){
    this.modalController.dismiss({
      dismissed: true
    })
  }

}
