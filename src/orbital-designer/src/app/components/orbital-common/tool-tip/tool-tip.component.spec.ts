import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolTipComponent } from './tool-tip.component';
import { MatIconModule } from '@angular/material/icon';

describe('ToolTipComponent', () => {
  let component: ToolTipComponent;
  let fixture: ComponentFixture<ToolTipComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [MatTooltipModule, MatIconModule],
      declarations: [ToolTipComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
