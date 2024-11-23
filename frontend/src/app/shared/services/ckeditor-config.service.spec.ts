import { TestBed } from '@angular/core/testing';

import { CKEditorConfigService } from './ckeditor-config.service';

describe('CKEditorConfigService', () => {
  let service: CKEditorConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CKEditorConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
