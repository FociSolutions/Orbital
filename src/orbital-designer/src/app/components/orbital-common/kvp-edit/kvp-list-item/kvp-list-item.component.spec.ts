import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KvpListItemComponent } from './kvp-list-item.component';

describe('KvpListItemComponent', () => {
  let component: KvpListItemComponent;
  let fixture: ComponentFixture<KvpListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KvpListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
