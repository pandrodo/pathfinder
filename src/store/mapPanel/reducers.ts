import { MapPanelState, MapPanelTypes, LOAD_ROAD_GRAPH } from "./types";

const initialState: MapPanelState = {
    roadGraph: ''
};

export function mapPanelReducer(
    state = initialState,
    action: MapPanelTypes
): MapPanelState {
    switch (action.type) {
        case LOAD_ROAD_GRAPH:
            return state;
        default:
            return state;
    }
}