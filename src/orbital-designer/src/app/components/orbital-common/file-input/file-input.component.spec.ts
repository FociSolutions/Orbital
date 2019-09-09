import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileInputComponent } from './file-input.component';
import * as faker from 'faker';

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
    it('If allowMultiple is false, updates the control value with the input file and update the display property', () => {
      const content = faker.random.word();
      const Expected = new File([content], 'test.txt');
      component.onFileChange(([Expected] as unknown) as FileList);
      expect(component.fileNames).toEqual('test.txt');
      expect(component.control.value).toEqual(Expected);
    });

    it('If allowMultiple is true, updates the control value with an array of files and update the display property', () => {
      component.allowMultiple = true;
      const content = faker.random.word();
      const ExpectedList: File[] = [];
      for (let i = 0; i < 3; i++) {
        ExpectedList.push(new File([content], `file${i}.txt`));
      }

      const ExpectedDisplay = 'file0.txt, file1.txt, file2.txt';
      component.onFileChange((ExpectedList as unknown) as FileList);
      expect(component.control.value).toEqual(ExpectedList);
      expect(component.fileNames).toEqual(ExpectedDisplay);
    });

    it('fileList is empty, does not change value or display', () => {
      const ExpectedDisplay = component.fileNames;
      const ExpectedValue = component.control.value;
      component.onFileChange(([] as unknown) as FileList);
      expect(component.control.value).toEqual(ExpectedValue);
      expect(component.fileNames).toEqual(ExpectedDisplay);
    });

    it('should mark the control as dirty', () => {
      expect(component.control.dirty).toBeFalsy();
      const content = faker.random.word();
      const file = new File([content], 'test.txt');
      component.onFileChange(([File] as unknown) as FileList);
      expect(component.control.dirty).toBeTruthy();
    });
  });
});
