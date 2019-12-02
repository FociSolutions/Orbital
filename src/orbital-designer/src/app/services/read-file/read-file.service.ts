import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilerReadService {
  constructor(private logger: NGXLogger) {}

  /**
   * Takes a file as input and returns a promise that will resolve to a string representing
   * the contents of the file
   * @param file an Object representing the file to read
   * @returns a promise containing a string representing the file contents
   */
  read(file: File): Observable<string> {
    const fileReader = new FileReader();
    return Observable.fromEvent((resolve, reject) => {
      fileContent.readAsText(file);
      fileContent.onload = () => {
        const contentString = fileContent.result as string;
        resolve(contentString);
      };
    });
  }
}

}
