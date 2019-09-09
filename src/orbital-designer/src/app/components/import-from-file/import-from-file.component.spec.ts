import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromFileComponent } from './import-from-file.component';

describe('ImportFromFileComponent', () => {
  let component: ImportFromFileComponent;
  let fixture: ComponentFixture<ImportFromFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFromFileComponent ]
    })
    .compileComponents();
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
