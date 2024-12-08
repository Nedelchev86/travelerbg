import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { ActivityCategory } from '../activities/activity-iterface';

@Component({
  selector: 'app-activities-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './activities-layout.component.html',
  styleUrl: './activities-layout.component.css',
})
export class ActivitiesLayoutComponent implements OnInit {
  public max_price: number = 300;

  public categories: any = Array<any>();
  public searchQuery: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.max_price = params['max_price'] ? +params['max_price'] : 0;
    });
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.activityService.fetchCategories().subscribe({
      next: (data: ActivityCategory[]) => {
        this.categories = data;
      },
      error: (err) => console.log(err),
    });
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.updateQueryParams();
  }

  onMaxValueChange(event: any): void {
    const value = event.target.value;
    this.max_price = value;
  }
  onMaxValueChangeComplete(): void {
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    this.router.navigate(['/activities'], {
      relativeTo: this.route,
      queryParams: {
        max_price: this.max_price,
        title: this.searchQuery || null,
      },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }
}
