import { Pipe, PipeTransform } from '@angular/core';
import { VerbType } from 'src/app/models/verb-type';

@Pipe({
  name: 'getVerbString',
})
export class GetVerbStringPipe implements PipeTransform {
  /**
   * Takes in a verbTypes and outputs the corresponding verb as a string
   * @param verb The verbType to be piped in
   */
  transform(verb: VerbType): string {
    return VerbType[verb];
  }
}
