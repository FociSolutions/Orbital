import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { OverviewRedirectService } from './overview-redirect.service';
import { DesignerStore } from '../../store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('OverviewRedirectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, LoggerTestingModule],
      providers: [DesignerStore],
    });
  });

  it('should be created', () => {
    const service: OverviewRedirectService = TestBed.inject(OverviewRedirectService);
    expect(service).toBeTruthy();
  });

  it('should call navigate if no MockDefinition', fakeAsync(() => {
    const service: OverviewRedirectService = TestBed.inject(OverviewRedirectService);
    const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    service.canActivate();
    tick();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  }));

  it('should not call navigate if there exists a MockDefinition', fakeAsync(() => {
    const service: OverviewRedirectService = TestBed.inject(OverviewRedirectService);
    const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    const store = TestBed.inject(DesignerStore);
    store.updateMetadata({
      title: '',
      description: '',
    });
    service.canActivate();
    tick();
    expect(routerSpy).not.toHaveBeenCalled();
  }));
});
