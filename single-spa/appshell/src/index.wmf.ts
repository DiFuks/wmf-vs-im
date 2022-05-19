import {
  registerApplication,
  RegisterApplicationConfig,
  start,
} from 'single-spa';
import {
  constructLayoutEngine,
  constructRoutes,
  WithLoadFunction,
} from 'single-spa-layout';

window.sharedAppUrl = 'http://localhost:9001';
window.sharedApp2Url = 'http://localhost:9002';

const routes = constructRoutes(document.querySelector('#single-spa-layout'));

const applications: Array<RegisterApplicationConfig & WithLoadFunction> = [
  {
    name: 'sharedApp/App',
    app: () => import('sharedApp/App'),
    activeWhen: (location) => location.pathname === '/',
  },
  {
    name: 'sharedApp2/App',
    app: () => import('sharedApp2/App'),
    activeWhen: (location) => location.pathname.startsWith('/shared2'),
  },
];

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

applications.forEach((app) => registerApplication(app));

layoutEngine.activate();
start();
