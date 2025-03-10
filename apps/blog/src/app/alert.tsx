import { useEffect, useState } from 'react';
import { Store } from '@mrcmichael/shared-state';

interface NotificationAlertProps {
  store: Store;
}

export function NotificationAlert({ store }: NotificationAlertProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const subscription = store.getState().subscribe((state) => {
      const newUnreadCount = state.notifications.filter((n) => !n.read).length;

      if (newUnreadCount > unreadCount) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      }

      setUnreadCount(newUnreadCount);
    });

    return () => subscription.unsubscribe();
  }, [store, unreadCount]);

  if (!showAlert || unreadCount === 0) return null;

  return (
    <div className="notification-alert">
      <span>
        You have {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
      </span>
      <button className="close-btn" onClick={() => setShowAlert(false)}>
        <i className="material-icons">close</i>
      </button>
    </div>
  );
}
