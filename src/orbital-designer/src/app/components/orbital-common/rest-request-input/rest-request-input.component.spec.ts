import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestRequestInputComponent } from './rest-request-input.component';
import { OrbitalCommonModule } from '../orbital-common.module';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { promise } from 'protractor';
import { doesNotThrow } from 'assert';

describe('RestRequestInputComponent', () => {
  let component: RestRequestInputComponent;
  let fixture: ComponentFixture<RestRequestInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RestRequestInputComponent],
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestRequestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send a successful get request to localhost', async () => {
    await component
      .sendRequest('http://localhost:4200')
      .toPromise()
      .then(result => {
        expect(result).toBeTruthy();
      });
  });
});
