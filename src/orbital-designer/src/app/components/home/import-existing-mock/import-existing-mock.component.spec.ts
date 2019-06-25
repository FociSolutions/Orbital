import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExistingMockComponent } from './import-existing-mock.component';

describe('ImportExistingMockComponent', () => {
  let component: ImportExistingMockComponent;
  let fixture: ComponentFixture<ImportExistingMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExistingMockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExistingMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
