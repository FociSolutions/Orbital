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
import { RouterModule } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointListComponent } from '../endpoint-list/endpoint-list.component';
import { EndpointViewComponent } from '../endpoint-view.component';

describe('EndpointListItemComponent', () => {
  let component: EndpointListItemComponent;
  let fixture: ComponentFixture<EndpointListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EndpointListItemComponent, EndpointListComponent],
      imports: [AppModule],
      providers: [DesignerStore]
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
