import { Pipe, PipeTransform } from '@angular/core';
import { VerbType } from 'src/app/models/verb.type';

@Pipe({
  name: 'getVerbString',
})
export class GetVerbStringPipe implements PipeTransform {
  /**
   * Takes in a verbTypes and outputs the corresponding verb as a string
   * @param verb The verbType to be piped in
   */
  transform(verb: VerbType): string {
    switch (verb) {
      case VerbType.DELETE:
        return 'DELETE';
      case VerbType.GET:
        return 'GET';
      case VerbType.POST:
        return 'POST';
      case VerbType.PUT:
        return 'PUT';
      case VerbType.HEAD:
        return 'HEAD';
      case VerbType.OPTIONS:
        return 'OPTIONS';
      case VerbType.PATCH:
        return 'PATCH';
      case VerbType.CONNECT:
        return 'CONNECT';
      case VerbType.CUSTOM:
        return 'CUSTOM';
      case VerbType.NONE:
        return 'NONE';
      case VerbType.TRACE:
        return 'TRACE';
      default: {
        // Cause a type-check error if a case is missed
        const _: never = verb;
      }
    }
  }
}
