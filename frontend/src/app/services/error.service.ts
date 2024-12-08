import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private toastr: ToastrService) {}

  handleHttpError(error: any): void {
    // if (error.status === 401) {
    //   this.showUnauthorizedError(error);
    // } else if (error.status === 404) {
    //   this.showNotFoundError(error);
    // } else if (error.status >= 500) {
    //   this.showServerError(error);
    // } else {
    //   this.showGenericError(error);
    // }
  }

  showUnauthorizedError(error: any): void {
    this.toastr.error(
      error.error?.message || 'Unauthorized. Please log in again.',
      '401 Unauthorized'
    );
  }

  showNotFoundError(error: any): void {
    this.toastr.warning(
      error.error?.message || 'The requested resource was not found.',
      '404 Not Found'
    );
  }

  showServerError(error: any): void {
    this.toastr.error(
      'A server error occurred. Please try again later.',
      '500 Server Error'
    );
  }

  showGenericError(error: any): void {
    this.toastr.error(
      error.error?.message || 'An unexpected error occurred.',
      `Error ${error.status || ''}`
    );
  }

  handleRuntimeError(error: any): void {
    console.error('Runtime error:', error);
    this.toastr.error(
      'An unexpected error occurred. Please try again later.',
      'Runtime Error'
    );
  }
}
