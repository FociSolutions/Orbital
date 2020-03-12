import { Pipe, PipeTransform } from '@angular/core';
import { VerbType } from '../../models/verb.type';

@Pipe({
  name: 'getVerbColor'
})
export class GetVerbColorPipe implements PipeTransform {
  readonly blue: string = 'rgba(0, 163, 255, 0.25)';
  readonly green: string = 'rgba(30, 255, 160, 0.25)';
  readonly red: string = 'rgba(255, 0, 0, 0.25)';
  readonly yellow: string = 'rgba(250, 255, 0, 0.25)';
  readonly orange: string = 'rgba(255, 165, 0, 0.25)';
  readonly purple: string = 'rgba(82, 0, 255, 0.25)';
  readonly turquoise: string = 'rgba(64,224,208 ,1 )';
  readonly notsonavyblue: string = 'rgba(30,144,255 ,1)';

  /**
   * Returns a string containing the appropriate bootstrap color
   * class for the verb type. If a prefix string is passed into the parameters
   * then the pipe will prefix the color string with the prefix string.
   * @param verb The verb whose color we are trying to get
   * @param prefix An optional argument that prefixes the verbscdf
   * color string with the passed in string
   */
  transform(verb: VerbType, prefix: string = ''): string {
    switch (verb) {
      case VerbType.DELETE:
        return prefix + this.red;
      case VerbType.GET:
        return prefix + this.blue;
      case VerbType.POST:
        return prefix + this.green;
      case VerbType.PUT:
        return prefix + this.yellow;
      case VerbType.HEAD:
        return prefix + this.purple;
      case VerbType.OPTIONS:
        return prefix + this.notsonavyblue;
      case VerbType.PATCH:
        return prefix + this.turquoise;
    }
  }
}
