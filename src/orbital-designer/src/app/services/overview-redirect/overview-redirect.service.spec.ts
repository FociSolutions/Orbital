import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { OverviewRedirectService } from './overview-redirect.service';
import { DesignerStore } from '../../store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('OverviewRedirectService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), LoggerTestingModule],
      providers: [DesignerStore]
    })
  );

  it('should be created', () => {
    const service: OverviewRedirectService = TestBed.get(
      OverviewRedirectService
    );
    expect(service).toBeTruthy();
  });

  it('should call navigate if no MockDefinition', () => {
    const service: OverviewRedirectService = TestBed.get(
      OverviewRedirectService
    );
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    service.canActivate();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should not call navigate if there exists a MockDefinition', () => {
    const service: OverviewRedirectService = TestBed.get(
      OverviewRedirectService
    );
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    const store = TestBed.get(DesignerStore);
    store.updateMetadata({
      title: '',
      description: ''
    });
    service.canActivate();
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
