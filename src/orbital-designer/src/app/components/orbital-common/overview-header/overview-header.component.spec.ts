import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { OverviewHeaderComponent } from './overview-header.component';

describe('OverviewHeaderComponent', () => {
  let component: OverviewHeaderComponent;
  let fixture: ComponentFixture<OverviewHeaderComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [OverviewHeaderComponent],
      imports: [MatCardModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
