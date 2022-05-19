import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from 'single-spa-layout';
import { registerApplication, start } from 'single-spa';
import 'systemjs';

window.__remotes__ = {
  sharedApp: 'shared1@http://localhost:9001/shared.js',
  sharedApp2: 'shared2@http://localhost:9002/shared.js',
};

declare global {
  interface Window {
    __remotes__: Record<string, string>;
  }

  const __webpack_init_sharing__: any;
  const __webpack_share_scopes__: any;
}

async function dynamicImport(path: string) {
  const libraryName = path.split('/')[0];

  const [remoteName, remoteUrl] = Object.entries(window.__remotes__).find(
    ([r]) => libraryName === r,
  );

  if (!remoteName) {
    throw new Error(`URL not configured for remote '${path}'.`);
  }
  if (remoteUrl.split('@').length !== 2) {
    throw new Error(`URL misconfigured for remote '${path}'`);
  }

  const [moduleName, moduleUrl] = remoteUrl.split('@');

  await __webpack_init_sharing__('default');

  await new Promise<void>((resolve, reject) => {
    const element = document.createElement('script');

    element.src = moduleUrl;
    element.type = 'text/javascript';
    element.async = true;

    element.addEventListener('load', () => {
      element.remove();
      resolve();
    });

    element.addEventListener('error', (err) => {
      element.remove();
      reject(err);
    });

    document.head.append(element);
  });

  const container = window[moduleName];

  await container.init(__webpack_share_scopes__.default);

  const component = `.${path.replace(remoteName, '')}`;
  const factory = await container.get(component);

  return factory();
}

const routes = constructRoutes(document.querySelector('#single-spa-layout'));
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => dynamicImport(name),
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

applications.forEach((app) => registerApplication(app));

layoutEngine.activate();
start();
