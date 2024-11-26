import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = 'dzpgrtewh';
  private uploadPreset = 'travelerbg';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    console.log('test');
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    console.log('Uploading image to Cloudinary:', file);
    return this.http.post(url, formData);
  }
}
