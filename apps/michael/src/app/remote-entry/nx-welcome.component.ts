import { StoreService } from '../store';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule],
  template: `
    <h1>Welcome to Michael</h1>
    <div
      class="notifications-panel"
      *ngIf="notifications$ | async as notifications"
    >
      <div class="notifications-header">
        <h3>Notifications ({{ notifications.length }})</h3>
      </div>
      <div class="notifications-list" *ngIf="notifications.length > 0">
        <div
          class="notification-item {{ notification.type }} {{
            notification.read ? 'read' : ''
          }}"
          *ngFor="let notification of notifications"
        >
          <i class="material-icons">
            {{ getNotificationIcon(notification.type) }}
          </i>
          <span class="notification-message">{{ notification.message }}</span>

          <button
            class="btn btn-primary mark-read-btn"
            (click)="markNotificationAsRead(notification.id)"
            *ngIf="!notification.read"
          >
            Mark as read
          </button>
        </div>
      </div>
      <div class="no-notifications" *ngIf="notifications.length === 0">
        No new notifications
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {
  store = inject(StoreService);

  user$ = this.store.selectUser();
  theme$ = this.store.selectTheme();
  notifications$ = this.store.selectNotifications();
  currentTheme = this.theme$;

  toggleTheme() {
    this.theme$.pipe(take(1)).subscribe((currentTheme) => {
      this.store.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  markNotificationAsRead(id: string) {
    this.store.markNotificationAsRead(id);
  }

  getNotificationIcon(type: 'success' | 'info' | 'warning' | 'error'): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  }
}
