import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointListItemComponent } from './endpoint-list-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';
import { GetVerbStringPipe } from 'src/app/pipes/get-verb-string.pipe';

describe('EndpointListItemComponent', () => {
  let component: EndpointListItemComponent;
  let fixture: ComponentFixture<EndpointListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndpointListItemComponent,
        GetVerbColorPipe,
        GetVerbStringPipe
      ],
      imports: [
        MatCardModule,
        RouterTestingModule.withRoutes([]),
        LoggerTestingModule
      ],
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
