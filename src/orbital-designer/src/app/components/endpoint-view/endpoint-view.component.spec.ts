import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointViewComponent } from './endpoint-view.component';
import {MatCardModule} from '@angular/material/card';

describe('EndpointViewComponent', () => {
  let component: EndpointViewComponent;
  let fixture: ComponentFixture<EndpointViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointViewComponent ],
      imports: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in h1 tag', async(() => {
    // tslint:disable-next-line: no-shadowed-variable
    const fixture = TestBed.createComponent(EndpointViewComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Endpoint View Component');
  }));
});
