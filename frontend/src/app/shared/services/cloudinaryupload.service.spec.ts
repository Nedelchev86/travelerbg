import { TestBed } from '@angular/core/testing';

import { CloudinaryuploadService } from './cloudinaryupload.service';

describe('CloudinaryuploadService', () => {
  let service: CloudinaryuploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryuploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
