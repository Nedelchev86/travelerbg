import { Component, OnInit } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { HttpClient } from '@angular/common/http';
import { ShapeMockupDirective } from '../shape-mockup.directive';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-destination-details',
  standalone: true,
  imports: [CommonModule, SetBgImageDirective, ShapeMockupDirective],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.css',
})
export class DestinationDetailsComponent implements OnInit {
  destinationID: string = '';

  private apiUrl = 'http://127.0.0.1:8000/destinations/';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.destinationID = params['destinationID'];
    });
  }
}
