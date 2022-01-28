import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {

  public isLoading = this.spinner.isLoading$;

  constructor(
    private spinner: SpinnerService
  ) { }

  ngOnInit() {}
  

}
