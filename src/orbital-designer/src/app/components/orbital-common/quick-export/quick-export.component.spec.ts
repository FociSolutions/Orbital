import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickExportComponent } from './quick-export.component';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('QuickExportComponent', () => {
  let component: QuickExportComponent;
  let fixture: ComponentFixture<QuickExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickExportComponent],
      imports: [MatIconModule, RouterTestingModule.withRoutes([])]
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
