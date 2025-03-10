import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreService } from './store/store';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'shell';

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
