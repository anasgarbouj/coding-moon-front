import { Component } from '@angular/core';
import { LoadingIndicatorService } from '../loading-indicator.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  loading$ = this.loadingIndicatorService.loading$;

  constructor(private loadingIndicatorService: LoadingIndicatorService) { }
}
