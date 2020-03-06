import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickExportComponent } from './quick-export.component';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpClientModule } from '@angular/common/http';

describe('QuickExportComponent', () => {
  let component: QuickExportComponent;
  let fixture: ComponentFixture<QuickExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickExportComponent],
      imports: [MatIconModule, RouterTestingModule.withRoutes([]), LoggerTestingModule, HttpClientModule],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
