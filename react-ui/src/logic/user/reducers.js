import * as types from './types'
import { LOBBY_UPDATE, LOBBY_UPDATE_REJECTED } from '../lobby/types';

const DEFAULT_STATE = {
  name: undefined,
  token: undefined,
  registrationPending: false,
  loginPending: false,
  loggedIn: false,
  isLeader: false,
};


const reducer = (state = DEFAULT_STATE, action) => {
  // register
  switch (action.type) {
    case types.USER_REGISTER:
      state = {
        ...state,
        registrationPending: true
      };
      break;
    case types.USER_REGISTER_FULFILLED:
    case types.USER_REGISTER_REJECTED:
      state = {
        ...state,
        registrationPending: false
      };
      break;
    // login
    case types.USER_LOGIN:
      state = {
        ...state,
        loginPending: true
      };
      break;
    case types.USER_LOGIN_FULFILLED:
    case types.USER_LOGIN_REJECTED:
      state = {
        ...state,
        loginPending: false
      };
      break;
    // update
    case types.USER_UPDATE:
      state = {
        ...state,
        ...action.payload
      };
      break;
    case LOBBY_UPDATE_REJECTED:
      state = {
        ...state,
        isLeader: false
      };
      break;
    case LOBBY_UPDATE:
      state = {
        ...state,
        isLeader: state._id && state._id === action.payload.leaderId
      };
      break;
    case types.USER_UPDATE_REJECTED:
      state = {
        ...DEFAULT_STATE
      }
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
