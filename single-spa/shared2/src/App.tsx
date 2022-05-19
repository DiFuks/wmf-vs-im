import { FC } from 'react';
import { Link } from '@reach/router';

export const App: FC = () => (
  <div>
    Hello from shared app 2
    <div>
      <Link to='/'>To shared</Link>
    </div>
  </div>
);

export default App;
