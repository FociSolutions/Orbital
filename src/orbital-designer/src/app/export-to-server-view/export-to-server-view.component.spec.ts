 import { async, ComponentFixture, TestBed } from '@angular/core/testing';
 import { MatCardModule } from '@angular/material/card';
 import { Location } from '@angular/common';
 import { RouterTestingModule } from '@angular/router/testing';
 import { HttpClientTestingModule } from '@angular/common/http/testing';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { LoggerTestingModule } from 'ngx-logger/testing';
 import { OrbitalCommonModule } from 'src/app/components/orbital-common/orbital-common.module';
 import { ExportToServerViewComponent } from './export-to-server-view.component';
 import { DesignerStore } from '../store/designer-store';

 describe('ExportToServerViewComponent', () => {
  let component: ExportToServerViewComponent;
  let fixture: ComponentFixture<ExportToServerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportToServerViewComponent],
      imports: [
        MatCardModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        OrbitalCommonModule
      ],
      providers: [Location, DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportToServerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
