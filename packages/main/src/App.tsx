import { FC, lazy, Suspense } from 'react';

const SharedApp =
  process.env.TARGET === 'wmf'
    ? lazy(() => import('sharedApp/App'))
    : lazy(() => import(/* webpackIgnore: true */ 'sharedApp/App'));

export const App: FC = () => (
  <div>
    <div>Hello from main app</div>
    <Suspense fallback='loading...'>
      <SharedApp />
    </Suspense>
  </div>
);
