import * as types from './types'

const DEFAULT_STATE = {
  messages: []
};

const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case types.CHAT_UPDATE:
      state = {
        messages: [...state.messages, action.payload]
      };
      break;
    case types.CHAT_TRUNCATE:
      state = {
        ...DEFAULT_STATE
      };
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
