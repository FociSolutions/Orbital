import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddBodyRuleContainerComponent } from './add-body-rule-container.component';
import { AddBodyRuleComponent } from './add-body-rule/add-body-rule.component';
import { MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatDividerModule } from '@angular/material/divider';

describe('AddBodyRuleContainerComponent', () => {
  let component: AddBodyRuleContainerComponent;
  let fixture: ComponentFixture<AddBodyRuleContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBodyRuleContainerComponent, AddBodyRuleComponent ],
      imports: [ MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyRuleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
