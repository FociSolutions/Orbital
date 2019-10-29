import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetadataComponent } from './add-metadata.component';

describe('AddMetadataComponent', () => {
  let component: AddMetadataComponent;
  let fixture: ComponentFixture<AddMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
