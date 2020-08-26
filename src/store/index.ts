import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { controlPanelReducer } from "./controlPanel/reducers";
import { alertReducer } from "./alerts/reducers";
import { usersReducer } from "./users/reducers";

const rootReducer = combineReducers({
    alert: alertReducer,
    controlPanel: controlPanelReducer,
    userPanel: usersReducer,
    // mapPanel: mapPanelReducer,
});

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
        )
    );
}