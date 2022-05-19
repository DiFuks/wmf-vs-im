import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from 'single-spa-layout';
import { registerApplication, start } from 'single-spa';
import 'systemjs';
import { RemoteComponent } from 'mf-dynamic-remote-component';

window.__remotes__ = {
  'sharedApp/App': {
    path: 'http://localhost:9001/shared.js',
    scope: 'shared1',
    module: './App',
  },
  'sharedApp2/App': {
    path: 'http://localhost:9002/shared.js',
    scope: 'shared2',
    module: './App',
  },
};

const routes = constructRoutes(document.querySelector('#single-spa-layout'));
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => RemoteComponent(window.__remotes__[name]),
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

applications.forEach((app) => registerApplication(app));

layoutEngine.activate();
start();
