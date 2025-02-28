import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import App from './App';
import { WSChooserStore } from './store/WSChooserStore';

const container = document.getElementById('root');
const root = createRoot(container!);

WSChooserStore.getState().loadWorkspaces();

root.render(
  //<React.StrictMode>
  <App />,
  //</React.StrictMode>,
);
