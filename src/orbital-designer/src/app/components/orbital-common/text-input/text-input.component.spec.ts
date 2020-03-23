import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TextInputComponent } from './text-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TextInputComponent', () => {
  let control: FormControl;
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [TextInputComponent],
      imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    control = new FormControl('', []);
    component.control = control;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TextInputComponent.setDirty', () => {
    it('should set the controls dirty flag to true', () => {
      component.setDirty();
      expect(component.control.dirty).toBeTruthy();
    });
  });
});
