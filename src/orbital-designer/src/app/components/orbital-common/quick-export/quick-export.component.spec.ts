import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuickExportComponent } from './quick-export.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpClientModule } from '@angular/common/http';

describe('QuickExportComponent', () => {
  let component: QuickExportComponent;
  let fixture: ComponentFixture<QuickExportComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [QuickExportComponent],
      imports: [MatIconModule, RouterTestingModule, LoggerTestingModule, HttpClientModule],
      providers: [DesignerStore]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
