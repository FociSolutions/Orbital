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

describe('openCancelDialogOrNavigateUrl', () => {
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

  it('should not navigate if url contains scenario-editor', () => {
    const comp = component;
  });

  it('should call exportMockDefinition() if a URL and Mockdefinition are cached in service', () => {});

  it('should navigate to export-to-server if a URL and Mockdefinition arent cached in service', () => {});
});
