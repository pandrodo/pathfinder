import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { inputFormReducer } from "./inputForm/reducers";
import { mapReducer } from "./map/reducers";
import { alertReducer } from "./alerts/reducers";
import { usersReducer } from "./users/reducers";

const rootReducer = combineReducers({
    alert: alertReducer,
    inputForm: inputFormReducer,
    userPanel: usersReducer,
    map: mapReducer,
});

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
    return createStore(
        rootReducer, composeWithDevTools(
            applyMiddleware(thunk),
        )
    );
}