import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom'

import BondDetail from './components/Bond/BondDetail';
import Layout from './layout';
import { loadAppDetails } from './core/store/slices/appSlice';
import { loadAccountDetails } from './core/store/slices/accountSlice';
import { useWeb3Context, useAddress } from './core/hooks/web3Context';
import { useBonds } from './core/hooks/useBonds';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Stake = lazy(() => import('./pages/Stake'));
const Bond = lazy(() => import('./pages/Bond'));
const Calculator = lazy(() => import('./pages/Calculator'));

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { connect, hasCachedProvider, provider, chainID, connected } = useWeb3Context();
  const address = useAddress();
  const { bonds } = useBonds(chainID);

  useEffect(() => {
    dispatch(loadAppDetails({networkID: chainID, provider}));
  }, []);

  useEffect(() => {
    dispatch(loadAccountDetails({networkID: chainID, address, provider}))
  }, [connected]);

  useEffect(() => {
    // @ts-ignore
    if (hasCachedProvider()) {
      connect();
    }
  }, []);

  return (
    <Layout>
      <Suspense fallback={<div>Loading... </div>}>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/">
            <Redirect to="/stake"/>
          </Route>
          <Route exact path="/stake" component={Stake}/>
          <Route exact path="/bonds" component={Bond}/>
          <Route exact path="/calculator" component={Calculator}/>
          {bonds.map((bond: any) => {
            return (
              <Route exact key={bond.name} path={`/bonds/${bond.name}`}>
                <BondDetail bond={bond}/>
              </Route>
            );
          })}
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
