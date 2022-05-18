import { createRoot } from 'react-dom/client';
import React from 'react';

import { App } from '@wmf/App';

const appId = process.env.APP_ID;

if (!appId) {
  throw new Error('APP_ID is not defined');
}

const container = document.querySelector(`#${appId}`);

if (!container) {
  throw new Error('container is not defined');
}

const root = createRoot(container);

root.render(<App />);
