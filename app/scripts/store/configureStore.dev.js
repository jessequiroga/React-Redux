import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { routeReducer } from 'redux-simple-router';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { apiMiddleware } from 'redux-api-middleware';

import rootReducer from '../reducers';
import DevTools from '../components/DevTools';

const createStoreWithMiddleware = compose(
	applyMiddleware(thunk, apiMiddleware, createLogger()),
	DevTools.instrument()
)(createStore);

const reducer = combineReducers(Object.assign({}, rootReducer, {
	routing: routeReducer
}));

export default (initialState) => {
	const store = createStoreWithMiddleware(reducer, initialState);

	// Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
	if (module.hot) {
		module.hot.accept('../reducers', () =>
			store.replaceReducer(rootReducer)
		);
	}

	return store;
};
