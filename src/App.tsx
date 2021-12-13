import React from 'react';
import { Router } from 'react-router-dom'

import history from './routerHistory'

const App: React.FC = () => {
  return (
    <Router history={ history }>
    </Router>
  );
}

export default App;
