import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EndpointViewComponent } from './endpoint-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OverviewHeaderComponent } from '../../shared/components/overview-header/overview-header.component';
import SampleMockDefinition from '../../../test-files/test-mockdefinition-object';
import { SharedModule } from '../../shared/shared.module';
import { EndpointListComponent } from './endpoint-list/endpoint-list.component';
import { EndpointListItemComponent } from './endpoint-list-item/endpoint-list-item.component';
import { SideBarComponent } from '../../shared/components/side-bar/side-bar.component';
import { MatCardModule } from '@angular/material/card';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GetVerbStringPipe } from 'src/app/pipes/get-verb-string/get-verb-string.pipe';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';

describe('EndpointViewComponent', () => {
  let component: EndpointViewComponent;
  let fixture: ComponentFixture<EndpointViewComponent>;
  let store: DesignerStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EndpointViewComponent,
        OverviewHeaderComponent,
        EndpointListComponent,
        EndpointListItemComponent,
        SideBarComponent,
        GetEndpointScenariosPipe,
        GetVerbStringPipe,
        GetVerbColorPipe,
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        SharedModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [DesignerStore],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointViewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(DesignerStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('EndpointViewComponent.showNotFound()', () => {
    beforeEach(fakeAsync(() => {
      store.mockDefinition = SampleMockDefinition;
      tick();
      fixture.detectChanges();
    }));
    it('Should return false if endpoints list is not empty', () => {
      expect(component.showNotFound()).toBeFalsy();
    });

    it('Should return true if endpoints list is empty', () => {
      component.endpointList = [];
      fixture.detectChanges();
      expect(component.showNotFound()).toBeTruthy();
    });
  });
});
