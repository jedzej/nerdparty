import { createStore, combineReducers, applyMiddleware } from "redux";
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { reducer as notificationsReducer } from 'react-notification-system-redux';
import { createWebSocketMiddleWare, webSocketReducer } from './webSocketMiddleware';
import applications from './applications'

import commonEpics from './logic/common/epics';
import helloEpics from './logic/hello/epics';
import userEpics from './logic/user/epics';
import lobbyEpics from './logic/lobby/epics';
import chatEpics from './logic/chat/epics';
import observerEpics from './logic/observer/epics';
import appEpics from './logic/app/epics';

import helloReducer from './logic/hello/reducers';
import userReducer from './logic/user/reducers';
import lobbyReducer from './logic/lobby/reducers';
import chatReducer from './logic/chat/reducers';
import observerReducer from './logic/observer/reducers';
import appReducer from './logic/app/reducers';

import { routerReducer, routerMiddleware } from "react-router-redux";


const rootEpic = combineEpics(
  commonEpics,
  helloEpics,
  userEpics,
  lobbyEpics,
  chatEpics,
  observerEpics,
  appEpics,
  ...Object.values(applications)
    .map(app => app.epic)
    .filter(epic => epic !== undefined)
);

const rootReducer = combineReducers({
  'websocket': webSocketReducer,
  'notifications': notificationsReducer,
  'router': routerReducer,
  'hello': helloReducer,
  'user': userReducer,
  'lobby': lobbyReducer,
  'chat': chatReducer,
  'observer': observerReducer,
  'app': appReducer,
  ...Object.values(applications)
    .filter(app => app.reducer !== undefined)
    .reduce((map, app) => {
      map[app.MANIFEST.NAME.toLowerCase()] = app.reducer;
      return map;
    }, {})

});


export default history => createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    createWebSocketMiddleWare(window.location.origin.replace(/http/, "ws").replace('3000','5000')),
    createEpicMiddleware(rootEpic),
    routerMiddleware(history)
  )
);
