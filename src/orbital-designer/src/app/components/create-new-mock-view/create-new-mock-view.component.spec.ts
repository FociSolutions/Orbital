import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { CreateNewMockViewComponent } from './create-new-mock-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateNewMockViewComponent', () => {
  let component: CreateNewMockViewComponent;
  let fixture: ComponentFixture<CreateNewMockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewMockViewComponent],
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
