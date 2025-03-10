import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { store, AppState } from '@mrcmichael/shared-state';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  getState() {
    return store.getState();
  }

  select<T>(selector: (state: AppState) => T) {
    return store.getState().pipe(
      map(selector),
      tap((value) => console.log('State', value))
    );
  }

  selectUser() {
    return this.select((state) => state.user);
  }

  selectTheme() {
    return this.select((state) => state.theme);
  }

  selectNotifications() {
    return this.select((state) => state.notifications);
  }

  setUser = store.setUser.bind(store);
  setTheme = store.setTheme.bind(store);
  addNotification = store.addNotification.bind(store);
  markNotificationAsRead = store.markNotificationAsRead.bind(store);
}
