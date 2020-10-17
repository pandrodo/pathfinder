export interface MapState {
    availablePathfinders: string[];
}

export const SET_AVAILABLE_PATHFINDERS = 'SET_AVAILABLE_PATHFINDERS';

interface SetAvailablePathfindersAction {
    type: typeof SET_AVAILABLE_PATHFINDERS;
    availablePathfinders: string[];
}

export type MapTypes = SetAvailablePathfindersAction;