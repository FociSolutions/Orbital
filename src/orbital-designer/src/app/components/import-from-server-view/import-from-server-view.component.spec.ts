import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromServerViewComponent } from './import-from-server-view.component';

describe('ImportFromServerViewComponent', () => {
  let component: ImportFromServerViewComponent;
  let fixture: ComponentFixture<ImportFromServerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFromServerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromServerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
