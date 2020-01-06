import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from './side-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { DesignerStore } from 'src/app/store/designer-store';
import validMockDefinition from '../../../../test-files/test-mockdefinition-object';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { DialogBoxComponent } from '../../orbital-common/dialog-box/dialog-box.component';
import { MatCardModule } from '@angular/material';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;
  let store: DesignerStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarComponent, DialogBoxComponent],
      imports: [
        MatSidenavModule,
        MatDividerModule,
        MatListModule,
        MatCardModule,
        MatIconModule,
        LoggerTestingModule,
        RouterTestingModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition as MockDefinition;
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Check if a valid mockdefinition is passed to the isSelected method.
  // Then, confirm the value returned is selected by having a true response.
  describe('SideBarComponent.isSelected', () => {
    it('should return true if selected a valid Mock Defintion', () => {
      const title = component.selectedMockDefinition;
      const expected = validMockDefinition.metadata.title;
      expect(expected).toEqual(title);
      expect(component.isSelected(title)).toBeTruthy();
    });
  });
  // Check if a false value was passed to the isSelected method.
  describe('SideBarComponent.isSelected', () => {
    it('should return false if the mockDefinitions title list is not selected', () => {
      const title = validMockDefinition.metadata.title + 'false';
      expect(component.isSelected(title)).toBeFalsy();
    });
  });
  // Test the updateSelected method that passes by passing the latest mock definition stored in the state
  // and compared against a valid mock mockdefinition.
  describe('SideBarComponent.updateSelected', () => {
    it('should return true if the mockDefinitions menu item is updated and navigate to endpoint-view', () => {
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      const expected = validMockDefinition;
      component.updateSelected(validMockDefinition);
      expect(store.state.mockDefinition).toEqual(expected);
      expect(routerSpy).toHaveBeenCalled();
    });
  });
  describe('SideBarComponent.openDialogBox', () => {
    it('should return to homepage if last mockdefinition is dismissed', () => {
      const routerSpy = spyOn(TestBed.get(Router), 'navigate');
      component.mockDefinitions.set(
        validMockDefinition.metadata.title,
        validMockDefinition
      );

      component.onDismiss({
        key: validMockDefinition.metadata.title,
        value: validMockDefinition
      });
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });
  });
});
