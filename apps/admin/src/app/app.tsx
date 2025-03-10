import NxWelcome from './nx-welcome';

import * as ReactDOM from 'react-dom/client';

export function defineReactWebComponent(
  component: React.ReactElement,
  name: string
) {

  console.log("defineReactWebComponent: admin-react");
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

export function App() {
  return (
    <div>
      <NxWelcome title="admin" />
    </div>
  );
}

defineReactWebComponent(<App />, 'admin-react');

export default App;
