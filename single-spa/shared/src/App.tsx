import { FC } from 'react';
import { Link } from '@reach/router';

export const App: FC = () => (
  <div>
    Hello from shared app
    <div>
      <Link to='/shared2'>To shared 2</Link>
    </div>
  </div>
);

export default App;
