import produce from 'immer';

const initialState = {
  processes: [],
  logs: {}, // {show: false, out: '', err: ''}
};

export default function reducer(oldState = initialState, action) {
  const actionType = action.type;
  const payload = action.payload;

  // console.info(`actionType: ${actionType}`);

  switch (actionType) {
    case 'process/setItems':
      return produce(oldState, (draft) => {
        draft.processes = payload.items;
      });
    case 'logs/set':
      return produce(oldState, (draft) => {
        draft.logs = payload;
      });
    default:
      return oldState;
  }
}
