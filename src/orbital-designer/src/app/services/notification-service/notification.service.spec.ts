import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('NotificationServiceService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [NotificationService],
    }).compileComponents();
  });

  it('should be created', () => {
    const service: NotificationService = TestBed.inject(NotificationService);
    expect(service).toBeTruthy();
  });
});
