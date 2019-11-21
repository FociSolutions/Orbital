import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'filterInvalidControls'
})
export class FilterInvalidControlsPipe implements PipeTransform {
  transform(value: AbstractControl[]): any {
    return value.filter(control => control.valid);
  }
}
