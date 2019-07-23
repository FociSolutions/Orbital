import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ImportExistingMockComponent } from './import-existing-mock/import-existing-mock.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { EndpointsStore } from 'src/app/store/endpoints-store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent, ImportExistingMockComponent],
      providers: [MockDefinitionStore, EndpointsStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
