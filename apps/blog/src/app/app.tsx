import NxWelcome from './nx-welcome';
import * as ReactDOM from 'react-dom/client';
import {
  useUser,
  useTheme,
  useNotifications,
  useUnreadNotificationsCount,
} from './store/useStore';
import { Store } from '@mrcmichael/shared-state';
import { NotificationAlert } from './alert';
import { useEffect } from 'react';

const notificationMessages = [
  '🎉 New feature released! Check it out!',
  '📝 Your draft has been auto-saved',
  '👋 Welcome to our new blog platform!',
  '🌟 Your last post is trending!',
  '📈 Your blog reached 1000 views today',
  '💡 Try our new dark mode feature',
  '✨ New theme templates available',
  '📱 Mobile app is now available',
  '🎨 Custom themes are now supported',
  '🔔 Someone mentioned you in a comment',
  '❤️ Your post received 100 likes',
  "🏆 You've earned a new badge!",
  '📊 Weekly analytics report is ready',
  "🎯 You've reached your daily goal",
  '🚀 Performance improvements deployed',
];

const alertStyles = `
.notification-alert {
  position: fixed;
  top: 80px;
  right: 20px;
  background-color: var(--secondary-color);
  color: white;
  padding: 12px 20px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification-alert .close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.notification-alert .close-btn:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-alert.hiding {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
`;

// Add this function to generate random notifications
const generateRandomNotification = () => {
  const randomMessage =
    notificationMessages[
      Math.floor(Math.random() * notificationMessages.length)
    ];

  const randomType =
    Math.random() > 0.5
      ? 'success'
      : Math.random() > 0.5
      ? 'info'
      : Math.random() > 0.5
      ? 'warning'
      : 'error';

  return {
    id: Date.now().toString(),
    message: randomMessage,
    type: randomType,
    timestamp: new Date().toISOString(),
  };
};

export function defineReactWebComponent(
  component: React.ReactElement,
  name: string
) {
  class ReactWebComponent extends HTMLElement {
    private root: ReactDOM.Root | null = null;

    connectedCallback() {
      this.root = ReactDOM.createRoot(this);
      this.root.render(component);
    }

    disconnectedCallback() {
      this.root?.unmount();
    }
  }
  if (!customElements.get(name)) {
    customElements.define(name, ReactWebComponent);
  }
}

const storeInstance = Store.getInstance();

export function App() {
  const theme = useTheme();
  const notifications = useNotifications();
  const unreadNotificationsCount = useUnreadNotificationsCount();

  useEffect(() => {
    // Ensure theme is applied when component mounts
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          ${alertStyles}
.appContainer {
  min-height: 100vh;
  background-color: var(--background-primary);
  color: var(--text-primary);
  transition: background-color var(--transition-speed) ease;
}

.appContainer.dark {
  --text-primary: #fff;
  --text-secondary: #b0b0b0;
  --background-primary: #121212;
  --background-secondary: #1e1e1e;
}

.contentWrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: calc(var(--spacing-unit) * 3);
}

.appHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--spacing-unit) * 2);
  background-color: var(--background-secondary);
  border-radius: var(--border-radius);
  margin-bottom: calc(var(--spacing-unit) * 3);
}

.headerActions {
  display: flex;
  align-items: center;
}

.userProfile {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-unit) * 2);
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.userInfo {
  text-align: right;
}

.welcomeText {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.userName {
  font-weight: bold;
  margin: 0;
}

.controlsSection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: calc(var(--spacing-unit) * 3);
  padding: calc(var(--spacing-unit) * 2);
  background-color: var(--background-secondary);
  border-radius: var(--border-radius);
}

.themeToggle {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-unit) * 2);
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-unit);
  padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-speed) ease;
}

.btnPrimary {
  background-color: var(--primary-color);
  color: white;
}

.btnPrimary:hover {
  background-color: var(--secondary-color);
}

.btnSecondary {
  background-color: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--text-secondary);
}

.btnSecondary:hover {
  background-color: var(--background-primary);
}

.btnIcon {
  padding: var(--spacing-unit);
  border-radius: 50%;
  background: transparent;
  color: var(--text-primary);
}

.btnIcon:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.welcomeSection {
  background-color: var(--background-secondary);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 3);
  margin-top: calc(var(--spacing-unit) * 3);
}

@media (max-width: 768px) {
  .contentWrapper {
    padding: var(--spacing-unit);
  }

  .controlsSection {
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 2);
  }

  .appHeader {
    flex-direction: column;
    text-align: center;
    gap: calc(var(--spacing-unit) * 2);
  }
}

          `,
        }}
      />
      <div className={`app-container ${theme}`}>
        <div className="content-wrapper">
          <header className="app-header">
            <h1>Blog Dashboard ReactJs Application</h1>

            <button
              className="btn btn-se scondary"
              onClick={() =>
                storeInstance.addNotification(generateRandomNotification())
              }
            >
              Add Notification
            </button>
            <div>Total Notifications:{notifications.length}</div>
            <div>Unread Notifications:{unreadNotificationsCount}</div>
            <NotificationAlert store={storeInstance} />
            <br />
            <br />
            <br />
            <br />
            <br />
          </header>
          <div className="welcome-section">
            <NxWelcome title="blog" />
          </div>
        </div>
      </div>
    </>
  );
}

defineReactWebComponent(<App />, 'blog-react');

export default App;
