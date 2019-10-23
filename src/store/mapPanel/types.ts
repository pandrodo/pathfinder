export interface MapPanelState {
    roadGraph: string;
}

export const LOAD_ROAD_GRAPH = 'LOAD_ROAD_GRAPH';

interface LoadRoadGraphAction {
    type: typeof LOAD_ROAD_GRAPH;
    roadGraph: string;
}

export type MapPanelTypes = LoadRoadGraphAction