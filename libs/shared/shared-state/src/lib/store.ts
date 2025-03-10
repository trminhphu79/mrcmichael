import { BehaviorSubject, Observable } from 'rxjs';
import { initialState } from './model';
import { AppState, User } from './model';

const SHARED_STORE_SYMBOL = 'SHARED_STORE' as const;

declare global {
  interface Window {
    readonly [SHARED_STORE_SYMBOL]?: Store;
  }
}

export class Store {
  private state: BehaviorSubject<AppState>;

  private constructor() {
    console.log('[Store] Initializing new store instance');
    this.state = new BehaviorSubject<AppState>(initialState);
  }

  public static getInstance(): Store {
    console.log('Get instance...', window[SHARED_STORE_SYMBOL]);
    if (!window[SHARED_STORE_SYMBOL]) {
      console.log('[Store] Creating new store instance');
      const store = new Store();

      // immutable store on window object :D
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
}

Object.freeze(Store);

export const store = Store.getInstance();
