import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointListItemComponent } from './endpoint-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

describe('EndpointListItemComponent', () => {
  let component: EndpointListItemComponent;
  let fixture: ComponentFixture<EndpointListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointListItemComponent ],
      imports: [
        MatCardModule,
        MatGridListModule
      ],
    })
    .compileComponents();
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
