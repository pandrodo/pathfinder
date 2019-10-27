import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import { controlPanelReducer } from "./controlPanel/reducers";

const rootReducer = combineReducers({
    controlPanel: controlPanelReducer,
    // mapPanel: mapPanelReducer,
});

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
    const middlewares = [thunkMiddleware];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    return createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer)
    );
}