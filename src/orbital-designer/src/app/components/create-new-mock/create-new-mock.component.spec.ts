import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNewMockComponent } from './create-new-mock.component';
import { NewMockFormComponent } from './new-mock-form/new-mock-form.component';
import { NewMockTitleComponent } from './new-mock-title/new-mock-title.component';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointsStore } from 'src/app/store/endpoints-store';

describe('CreateNewMockComponent', () => {
  let component: CreateNewMockComponent;
  let fixture: ComponentFixture<CreateNewMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateNewMockComponent,
        NewMockFormComponent,
        NewMockTitleComponent
      ],
      imports: [RouterTestingModule],
      providers: [MockDefinitionStore, EndpointsStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
