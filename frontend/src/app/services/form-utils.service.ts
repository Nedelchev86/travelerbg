import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  createFormData(form: FormGroup): FormData {
    const formData = new FormData();
    Object.keys(form.controls).forEach((key) => {
      if (key === 'tags') {
        const tags = form.get('tags')?.value;
        tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });
      } else if (key === 'highlights') {
        const highlights = form.get('highlights')?.value;
        if (typeof highlights === 'string') {
          return;
        }

        const selectedHighlights = highlights.filter(
          (highlight: number | boolean) => highlight !== false
        );
        selectedHighlights.forEach((highlight: number, index: number) => {
          formData.append(`highlights[${index}]`, highlight.toString());
        });
      } else if (key !== 'newTag') {
        const controlValue = form.get(key)?.value;
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        } else {
          formData.append(key, controlValue ?? '');
        }
      }
    });
    return formData;
  }
}
