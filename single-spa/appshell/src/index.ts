import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from 'single-spa-layout';
import { registerApplication, start } from 'single-spa';
import 'systemjs';

window.sharedAppUrl = 'http://localhost:9001';
window.sharedApp2Url = 'http://localhost:9002';

const routes = constructRoutes(document.querySelector('#single-spa-layout'));
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => {
    if (process.env.TARGET === 'system') {
      return System.import(name);
    }

    if (process.env.TARGET === 'im') {
      return import(/* webpackIgnore: true */ name);
    }

    if (process.env.TARGET === 'wmf') {
      return import(name);
    }

    throw new Error('Target is not defined');
  },
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

applications.forEach((app) => registerApplication(app));

layoutEngine.activate();
start();
