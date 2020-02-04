import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideBarComponent } from './side-bar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import validMockDefinition from '../../../../test-files/test-mockdefinition-object';
import { DesignerStore } from '../../../store/designer-store';
import { MockDefinition } from '../../../models/mock-definition/mock-definition.model';

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
    store.mockDefinition = validMockDefinition;
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checks that the h1 rendered content is equals to "MOCKDEFINITIONS"
  it('should render title in h1 tag', async(() => {
    // tslint:disable-next-line: no-shadowed-variable
    const fixture = TestBed.createComponent(SideBarComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'MOCKDEFINITIONS'
    );
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
    it('should return true if the Mockdefinitions menu item is updated and navigate to endpoint-view', () => {
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
      component.mockDefinitions = [validMockDefinition];

      component.onDismiss(validMockDefinition);
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });
  });
});
