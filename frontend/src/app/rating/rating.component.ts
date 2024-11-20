import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarEmpty,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent implements OnChanges {
  @Input() rating: number = 0;
  @Input() data: any = {};
  @Output() rated = new EventEmitter<number>();

  authService = inject(AuthService);
  toast = inject(ToastrService);
  stars: { icon: IconDefinition; class: string }[] = [];
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faStarEmpty = faStarEmpty;
  hoverIndex: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rating']) {
      this.updateStars();
    }
  }

  rate(rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }
    this.rating = rating;
    this.updateStars();
    this.rated.emit(this.rating);
  }

  setHover(index: number): void {
    this.hoverIndex = index;
  }

  clearHover(): void {
    this.hoverIndex = null;
  }

  private updateStars(): void {
  
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= this.rating) {
        this.stars.push({ icon: this.faStar, class: 'full-star' });
      } else if (i - 0.5 <= this.rating) {
        this.stars.push({ icon: this.faStarHalfAlt, class: 'half-star' });
      } else {
        this.stars.push({ icon: this.faStarEmpty, class: 'empty-star' });
      }
    }
  }
}
