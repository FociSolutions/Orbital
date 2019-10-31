import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddResponseComponent } from './add-response.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import * as faker from 'faker';

describe('AddResponseComponent', () => {
  let component: AddResponseComponent;
  let fixture: ComponentFixture<AddResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddResponseComponent],
      imports: [OrbitalCommonModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addResponse.setStatusCode', () => {
    it('should expect the corresponding status code message in the status field if the status code is valid ', () => {
      component.statusCode = '200';
      expect(component.statusMessage).toEqual('OK');
    });

    it('should expect the corresponding status code message in the status field if the status code is invalid ', () => {
      component.statusCode = '';
      expect(component.statusMessage).toEqual('Enter a Status Code');
    });

    it('should expect the corresponding status code message in the status field if the status code is empty', () => {
      component.statusCode = faker.lorem.words();
      expect(component.statusMessage).toEqual('Invalid Status Code');
    });
  });
});
