import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ImportFromFileComponent } from './import-from-file.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ImportFromFileComponent', () => {
  let component: ImportFromFileComponent;
  let fixture: ComponentFixture<ImportFromFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatCardModule,
        MatListModule,
        MatIconModule,
        OrbitalCommonModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
