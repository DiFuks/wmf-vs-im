import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from 'single-spa-layout';
import { registerApplication, start } from 'single-spa';
import 'systemjs';

const remotes = {
  'sharedApp/App': {
    path: 'http://localhost:9001/shared.js',
    route: '/',
    exact: true,
  },
  'sharedApp2/App': {
    path: 'http://localhost:9002/shared.js',
    route: '/shared2',
    exact: false,
  },
};

const importmapScript = document.createElement('script');

importmapScript.type =
  process.env.TARGET === 'im' ? 'importmap' : 'systemjs-importmap';

importmapScript.innerHTML = `
  {
      "imports": ${JSON.stringify(
        Object.fromEntries(
          Object.entries(remotes).map(([name, { path }]) => [name, path]),
        ),
      )}
    }
`;

document.head.append(importmapScript);

// Don't work with importmap

// document.head.innerHTML += `
//   <script type="${
//     process.env.TARGET === 'im' ? 'importmap' : 'systemjs-importmap'
//   }">
//     {
//       "imports": ${JSON.stringify(
//         Object.fromEntries(
//           Object.entries(remotes).map(([name, { path }]) => [name, path]),
//         ),
//       )}
//     }
//   </script>
// `;

document.body.innerHTML += `
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
  loadApp: ({ name }) => {
    if (process.env.TARGET === 'system') {
      return System.import(name);
    }

    if (process.env.TARGET === 'im') {
      return import(/* webpackIgnore: true */ name);
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
