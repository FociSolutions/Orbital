import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('NotificationServiceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [NotificationService],
    }).compileComponents()
  );

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });
});
