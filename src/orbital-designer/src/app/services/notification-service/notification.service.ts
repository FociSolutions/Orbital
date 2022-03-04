import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly default_snackbar_duration_ms = 3000;

  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  /**
   *
   * @param message The message to display
   * @param action The name of the button which dismisses the snackbar
   * @param duration How long in milliseconds to show the snackbar for
   */
  open(message: string, action?: string, duration: number = this.default_snackbar_duration_ms) {
    this.zone.run(() => {
      this.snackBar.open(message, action, { duration });
    });
  }
}
