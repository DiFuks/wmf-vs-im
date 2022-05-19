import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from 'single-spa-layout';
import { registerApplication, start } from 'single-spa';
import 'systemjs';
import { RemoteComponent } from 'mf-dynamic-remote-component';

const remotes = {
  'sharedApp/App': {
    path: 'http://localhost:9001/shared.js',
    scope: 'shared1',
    module: './App',
    route: '/',
    exact: true,
  },
  'sharedApp2/App': {
    path: 'http://localhost:9002/shared.js',
    scope: 'shared2',
    module: './App',
    route: '/shared2',
    exact: false,
  },
};

document.body.innerHTML = `
  <template id="single-spa-layout">
    <single-spa-router>
      ${Object.entries(remotes)
        .map(
          ([name, { route, exact }]) => `
            <route path="${route}" ${exact ? 'exact' : ''}>
              <application name="${name}"></application>
            </route>
          `,
        )
        .join('')}
    </single-spa-router>
  </template>
`;

const routes = constructRoutes(document.querySelector('#single-spa-layout'));
const applications = constructApplications({
  routes,
  loadApp: ({ name }) => RemoteComponent(remotes[name]),
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
  active: false,
});

applications.forEach((app) => registerApplication(app));

layoutEngine.activate();
start();
