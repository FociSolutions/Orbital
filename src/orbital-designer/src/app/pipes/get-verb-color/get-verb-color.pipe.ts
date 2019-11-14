import { Pipe, PipeTransform } from '@angular/core';
import { VerbType } from '../../models/verb.type';

@Pipe({
  name: 'getVerbColor'
})
export class GetVerbColorPipe implements PipeTransform {
  /**
   * Returns a string containing the appropriate bootstrap color
   * class for the verb type. If a prefix string is passed into the parameters
   * then the pipe will prefix the color string with the prefix string.
   * @param verb The verb whose color we are trying to get
   * @param prefix An optional argument that prefixes the verbs
   * color string with the passed in string
   */
  transform(verb: VerbType, prefix: string = ''): string {
    switch (verb) {
      case VerbType.DELETE:
        return prefix + 'rgba(255, 0, 0, 0.25)';
      case VerbType.GET:
        return prefix + 'rgba(0, 163, 255, 0.25)';
      case VerbType.POST:
        return prefix + 'rgba(30, 255, 160, 0.25)';
      case VerbType.PUT:
        return prefix + 'rgba(222, 256, 0, 0.25)';
    }
  }
}
