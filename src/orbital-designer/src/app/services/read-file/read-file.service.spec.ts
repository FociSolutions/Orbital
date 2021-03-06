import { TestBed } from '@angular/core/testing';
import { ReadFileService } from './read-file.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import * as faker from 'faker';

describe('ReadFileService', () => {
  let service: ReadFileService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [LoggerTestingModule],
      providers: []
    }).compileComponents();
    service = TestBed.get(ReadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ReadFileService.read', () => {
    it('should read a given file and return an observable with the content from the file', done => {
      const content = faker.random.word();

      service.read(new File([content], 'test.txt')).subscribe((fileContent: string) => {
        expect(fileContent).toBe(content);
        done();
      });
    });

    it('should read a given file and return an observable with the content from the file', done => {
      service.read(null).subscribe(
        () => {},
        (error: ProgressEvent) => {
          expect(error).toBeTruthy();
          done();
        }
      );
    });
  });
});
