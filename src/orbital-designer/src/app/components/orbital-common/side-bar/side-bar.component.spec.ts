import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from './side-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import validMockDefinition from '../../../../test-files/test-mockdefinition-object';
import { DesignerStore } from '../../../store/designer-store';
import { QuickExportComponent } from '../quick-export/quick-export.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let store: DesignerStore;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarComponent, DialogBoxComponent, QuickExportComponent],
      imports: [
        MatSidenavModule,
        MatDividerModule,
        MatListModule,
        MatCardModule,
        MatIconModule,
        LoggerTestingModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [DesignerStore]
    }).compileComponents();

    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition;
    tick();
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checks that the h1 rendered content is equals to "MOCKDEFINITIONS"
  it('should render title in h1 tag', waitForAsync(() => {
    // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
    const fixture = TestBed.createComponent(SideBarComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('MOCKDEFINITIONS');
  }));

  // Check if a valid mockdefinition is passed to the isSelected method.
  // Then, confirm the value returned is selected by having a true response.
  describe('SideBarComponent.isSelected', () => {
    it('should return true if selected a valid Mock Definition', () => {
      const title = component.selectedMockDefinition;
      const expected = validMockDefinition.metadata.title;
      expect(expected).toEqual(title);
      expect(component.isSelected(title)).toBeTruthy();
    });
  });
  // Check if a false value was passed to the isSelected method.
  describe('SideBarComponent.isSelected', () => {
    it('should return false if the Mockdefinitions title list is not selected', () => {
      const title = validMockDefinition.metadata.title + 'false';
      expect(component.isSelected(title)).toBeFalsy();
    });
  });
  // Test the updateSelected method that passes by passing the latest mock definition stored in the state
  // and compared against a valid mock Mockdefinitions.
  describe('SideBarComponent.updateSelected', () => {
    it('should return true if the Mockdefinitions menu item is updated and navigate to endpoint-view', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
        const expected = validMockDefinition;
        component.updateSelected(validMockDefinition);
        fixture.detectChanges();
        tick();
        expect(store.state.mockDefinition).toEqual(expected);
        expect(routerSpy).toHaveBeenCalled();
      });
    }));
  });
  describe('SideBarComponent.openDialogBox', () => {
    it('should return to homepage if last mockdefinition is dismissed', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const routerSpy = spyOn(TestBed.get(Router), 'navigate');
        component.mockDefinitions = [validMockDefinition];

        component.onDismiss(validMockDefinition);
        tick();
        fixture.detectChanges();
        expect(routerSpy).toHaveBeenCalledWith(['/']);
      });
    }));
  });
});
