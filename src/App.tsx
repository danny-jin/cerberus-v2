import React, { lazy, Suspense, useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom'

import Layout from './layout';
import BondDetail from './pages/Bond/BondDetail';
import { loadAppDetails } from './core/store/slices/appSlice';
import { loadAccountDetails, calculateUserBondDetails } from './core/store/slices/accountSlice';
import { calcBondDetails } from './core/store/slices/bondSlice';
import { useWeb3Context, useAddress } from './core/hooks/web3Context';
import { useBonds } from './core/hooks/useBonds';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Stake = lazy(() => import('./pages/Stake'));
const Bond = lazy(() => import('./pages/Bond'));
const Calculator = lazy(() => import('./pages/Calculator'));
const NotFound = lazy(() => import('./pages/404/NotFound'));

enum DetailLoadingType {
  App = 'APP',
  Account = 'ACCOUNT'
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {connect, hasCachedProvider, provider, chainID, connected} = useWeb3Context();
  const address = useAddress();
  const {bonds} = useBonds(chainID);
  const [walletChecked, setWalletChecked] = useState(false);

  const loadDetails = (detailLoadingType: DetailLoadingType) => {
    const loadProvider = provider;
    if (detailLoadingType === DetailLoadingType.App) {
      loadApp(loadProvider);
    }
    if (detailLoadingType === DetailLoadingType.Account && address && connected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({networkID: chainID, provider: loadProvider}));
      bonds.forEach(bond => {
        dispatch(calcBondDetails({bond, value: null, provider: loadProvider, networkID: chainID}));
      });
    },
    [connected],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({networkID: chainID, address, provider: loadProvider}));
      bonds.forEach(bond => {
        dispatch(calculateUserBondDetails({address, bond, provider, networkID: chainID}));
      });
    },
    [connected],
  );

  useEffect(() => {
    // @ts-ignore
    if (hasCachedProvider()) {
      connect();
      setWalletChecked(true);
    }
  }, []);

  useEffect(() => {
    if (walletChecked) {
      loadDetails(DetailLoadingType.App);
    }
  }, [walletChecked]);

  useEffect(() => {
    if (connected) {
      loadDetails(DetailLoadingType.Account);
    }
  }, [connected]);

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
          <Route component={NotFound}/>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
