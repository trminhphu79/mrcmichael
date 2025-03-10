import { useEffect, useState } from 'react';
import { store, AppState } from '@mrcmichael/shared-state';

export function useStore<T>(selector: (state: AppState) => T): T {
  const [value, setValue] = useState<T>(selector(store.getCurrentState()));

  useEffect(() => {
    const subscription = store.getState().subscribe((state) => {
      setValue(selector(state));
    });

    return () => subscription.unsubscribe();
  }, [selector]);

  return value;
}

export function useUser() {
  return useStore((state) => state.user);
}

export function useTheme() {
  return useStore((state) => state.theme);
}

export function useNotifications() {
  return useStore((state) => state.notifications);
}

export function useUnreadNotificationsCount() {
  return useStore((state) => state.notifications.filter((n) => !n.read).length);
}
