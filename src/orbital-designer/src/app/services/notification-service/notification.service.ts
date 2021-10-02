import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  /**
   *
   * @param message The message to display
   * @param action The name of the button which dismisses the snackbar
   * @param duration How long in milliseconds to show the snackbar for
   */
  public open(message: string,  action = null, duration = 3000) {
      this.zone.run(() => {
          this.snackBar.open(message, action, {duration});
      });
  }
}
