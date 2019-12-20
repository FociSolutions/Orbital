import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {
  constructor(private logger: NGXLogger) {}

  /**
   * Takes a file as input and returns a promise that will resolve to a string representing
   * the contents of the file
   * @param file an Object representing the file to read
   * @returns a promise containing a string representing the file contents
   */
  read(file: File): Observable<string> {
    const fileReader = new FileReader();
    return new Observable((observer) => {
      fileReader.readAsText(file);
      fileReader.onload = () => {
        const contentString = fileReader.result as string;
        this.logger.debug('File read succeeded');
        observer.next(contentString);
      };
      fileReader.onerror = (ev: ProgressEvent): void => {
        this.logger.debug('There was an error reading the file');
        observer.error(ev);
      };
    });
  }
}
