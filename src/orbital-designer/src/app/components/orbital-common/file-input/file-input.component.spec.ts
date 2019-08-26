import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileInputComponent } from './file-input.component';

describe('FileInputComponent', () => {
  let control: FormControl;
  let component: FileInputComponent;
  let fixture: ComponentFixture<FileInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileInputComponent],
      imports: [
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputComponent);
    component = fixture.componentInstance;
    control = new FormControl('', []);
    component.control = control;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('FileInputComponent.OnFileChange', () => {
    it('updates the control value with the input file', () => {
      const file = new File([''], 'test.txt', {
        type: 'text/plain',
        lastModified: new Date().getTime()
      });
      component.onFileChange({
        length: 1,
        item: x => file,
        0: file
      } as FileList);
      expect(control.value).toEqual(file);
      expect(component.fileName).toEqual('test.txt');
    });
  });
});
