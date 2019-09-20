import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ImportFromFileViewComponent } from './import-from-file-view.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DesignerStore } from '../../store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('ImportFromFileComponent', () => {
  let component: ImportFromFileViewComponent;
  let fixture: ComponentFixture<ImportFromFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFromFileViewComponent],
      imports: [
        MatCardModule,
        MatListModule,
        MatIconModule,
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
