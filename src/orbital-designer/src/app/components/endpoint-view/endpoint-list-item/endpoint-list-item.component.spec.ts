import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointListItemComponent } from './endpoint-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { DesignerStore } from 'src/app/store/designer-store';
import {
  NGXLoggerHttpService,
  NGXLogger,
  NGXMapperService,
  LoggerConfig
} from 'ngx-logger';
import { HttpBackend } from '@angular/common/http';

describe('EndpointListItemComponent', () => {
  let component: EndpointListItemComponent;
  let fixture: ComponentFixture<EndpointListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EndpointListItemComponent],
      imports: [MatCardModule, MatGridListModule],
      providers: [
        DesignerStore,
        NGXLoggerHttpService,
        NGXLogger,
        NGXMapperService,
        HttpBackend,
        LoggerConfig
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
