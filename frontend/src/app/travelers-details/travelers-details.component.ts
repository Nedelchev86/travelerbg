import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-travelers-details',
  standalone: true,
  imports: [],
  templateUrl: './travelers-details.component.html',
  styleUrl: './travelers-details.component.css',
})
export class TravelersDetailsComponent implements OnInit {
  @Input() travelerId!: string;
  http = inject(HttpClient);
  travelerDetails: any;

  ngOnInit() {
    console.log('Traveler ID:', this.travelerId);
    this.http

      .get(`http://127.0.0.1:8000/api/travelers/${this.travelerId}/`)
      .subscribe(
        (data: any) => {
          this.travelerDetails = data;
        },
        (error) => {
          console.error('Failed to fetch traveler details', error);
        }
      );
  }
}
