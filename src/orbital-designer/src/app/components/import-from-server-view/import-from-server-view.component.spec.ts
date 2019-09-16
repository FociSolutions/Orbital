import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ImportFromServerViewComponent } from './import-from-server-view.component';

describe('ImportFromServerViewComponent', () => {
  let component: ImportFromServerViewComponent;
  let fixture: ComponentFixture<ImportFromServerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportFromServerViewComponent],
      imports: [MatCardModule, RouterTestingModule],
      providers: [Location]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromServerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ImportFromServerViewComponent.onBack', () => {
    it('should call location.back()', () => {
      const locationSpy = spyOn(TestBed.get(Location), 'back');
      component.onBack();
      expect(locationSpy).toHaveBeenCalled();
    });
  });
});
