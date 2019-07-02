import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointListComponent } from './endpoint-list.component';
import { EndpointListItemComponent } from '../endpoint-list-item/endpoint-list-item.component';
import { EndpointsStore } from 'src/app/store/endpoints-store';

describe('EndpointListComponent', () => {
  let component: EndpointListComponent;
  let fixture: ComponentFixture<EndpointListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EndpointListComponent, EndpointListItemComponent],
      providers: [EndpointsStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
