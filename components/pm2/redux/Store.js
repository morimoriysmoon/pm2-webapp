import { createStore } from 'redux';

import reducer from './Reducer';

const PM2Store = createStore(reducer);
export default PM2Store;
