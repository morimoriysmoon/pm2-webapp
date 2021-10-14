import React from 'react';
import { Provider } from 'react-redux';

import Layout from '../components/layout';
import PM2Store from '../components/pm2/redux/Store';
import ProcessDashboard from '../components/pm2/ProcessDashboard';

export default function Index() {
  return (
    <Layout>
      <React.StrictMode>
        <Provider store={PM2Store}>
          <ProcessDashboard />
        </Provider>
      </React.StrictMode>
    </Layout>
  );
}
