import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { KvpEditComponent } from './kvp-edit.component';
import { OrbitalCommonModule } from '../orbital-common.module';

describe('KvpEditComponent', () => {
  let component: KvpEditComponent;
  let fixture: ComponentFixture<KvpEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
