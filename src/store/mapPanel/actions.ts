import {LOAD_ROAD_GRAPH, MapPanelTypes} from "./types";

export function loadRoadGraph(roadGraph: string): MapPanelTypes {
    return {
        type: LOAD_ROAD_GRAPH,
        roadGraph: roadGraph
    };
}