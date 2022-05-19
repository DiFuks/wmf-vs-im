import { FC, lazy, Suspense } from 'react';
import 'systemjs';

let SharedApp: FC;

if (process.env.TARGET === 'wmf') {
  SharedApp = lazy(() => import('sharedApp/App'));
}

if (process.env.TARGET === 'im') {
  SharedApp = lazy(() => import(/* webpackIgnore: true */ 'sharedApp/App'));
}

if (process.env.TARGET === 'system') {
  SharedApp = lazy(() => System.import('sharedApp/App'));
}

export const App: FC = () => (
  <div>
    <div>Hello from main app</div>
    <Suspense fallback='loading...'>
      <SharedApp />
    </Suspense>
  </div>
);
