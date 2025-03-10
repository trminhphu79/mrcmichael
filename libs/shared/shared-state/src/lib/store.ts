import { BehaviorSubject, Observable } from 'rxjs';
import { initialState } from './model';
import { AppState, User } from './model';

const SHARED_STORE_SYMBOL = 'SHARED_STORE' as const;
const STORAGE_KEY = 'APP_STATE' as const;

declare global {
  interface Window {
    readonly [SHARED_STORE_SYMBOL]?: Store;
  }
}

export class Store {
  private state: BehaviorSubject<AppState>;

  private constructor() {
    console.log('[Store] Initializing new store instance');

    const savedState = this.loadFromStorage();
    this.state = new BehaviorSubject<AppState>(savedState || initialState);

    this.state.subscribe((state) => {
      this.saveToStorage(state);
    });
  }

  private loadFromStorage(): AppState | null {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log('[Store] Loaded state from storage:', parsedState);
        return parsedState;
      }
    } catch (error) {
      console.error('[Store] Error loading state from storage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  }

  private saveToStorage(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('[Store] Saved state to storage');
    } catch (error) {
      console.error('[Store] Error saving state to storage:', error);
    }
  }

  public static getInstance(): Store {
    console.log('Get instance...', window[SHARED_STORE_SYMBOL]);
    if (!window[SHARED_STORE_SYMBOL]) {
      console.log('[Store] Creating new store instance');
      const store = new Store();

      Object.defineProperty(window, SHARED_STORE_SYMBOL, {
        value: store,
        configurable: false,
        writable: false,
        enumerable: true,
      });
    } else {
      console.log('[Store] Reusing existing store instance');
    }

    return window[SHARED_STORE_SYMBOL]!;
  }

  public clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.state.next(initialState);
      console.log('[Store] Storage cleared, reset to initial state');
    } catch (error) {
      console.error('[Store] Error clearing storage:', error);
    }
  }

  public cleanupOldNotifications(daysToKeep: number): void {
    const currentState = this.getCurrentState();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const updatedNotifications = currentState.notifications.filter(
      (notification) => {
        const notificationDate = new Date(notification.timestamp);
        return notificationDate > cutoffDate;
      }
    );

    this.setState({ notifications: updatedNotifications });
    console.log(
      `[Store] Cleaned up notifications older than ${daysToKeep} days`
    );
  }

  public getState(): Observable<AppState> {
    return this.state.asObservable();
  }

  public getCurrentState(): AppState {
    return this.state.getValue();
  }

  public setState(newState: Partial<AppState>): void {
    console.log('[Store] Setting new state:', newState);
    this.state.next({
      ...this.state.getValue(),
      ...newState,
    });
  }

  public setUser(user: User | null): void {
    this.setState({ user });
  }

  public setTheme(theme: 'light' | 'dark'): void {
    this.setState({ theme });
  }

  public addNotification(notification: any): void {
    const currentState = this.getCurrentState();
    this.setState({
      notifications: [...currentState.notifications, notification],
    });

    console.log('[Store] Added notification:', notification);
  }

  public markNotificationAsRead(id: string): void {
    const currentState = this.getCurrentState();
    const updatedNotifications = currentState.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.setState({ notifications: updatedNotifications });
  }

  public getUnreadNotificationsCount(): number {
    return this.getCurrentState().notifications.filter((n) => !n.read).length;
  }

  public markAllNotificationsAsRead(): void {
    const currentState = this.getCurrentState();
    const updatedNotifications = currentState.notifications.map((n) => ({
      ...n,
      read: true,
    }));
    this.setState({ notifications: updatedNotifications });
  }

  // Optional: Add a method to export state
  public exportState(): string {
    return JSON.stringify(this.getCurrentState(), null, 2);
  }

  // Optional: Add a method to import state
  public importState(stateJson: string): void {
    try {
      const newState = JSON.parse(stateJson);
      this.setState(newState);
      console.log('[Store] Successfully imported state');
    } catch (error) {
      console.error('[Store] Error importing state:', error);
    }
  }
}

Object.freeze(Store);

export const store = Store.getInstance();

// Optional: Add automatic cleanup of old notifications
setInterval(() => {
  store.cleanupOldNotifications(7); // Clean up notifications older than 7 days
}, 24 * 60 * 60 * 1000); // Run once per day
