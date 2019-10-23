import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { loadRoadGraph } from "./store/mapPanel/actions";
import { AppState } from "./store";

export const thunkLoadRoadGraph = (): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
    const roadGraph = await loadRoadGraphFromJSON();

    dispatch(
        loadRoadGraph(roadGraph)
    )
};

function loadRoadGraphFromJSON() {
    return ''
}