import {MapTypes, SET_AVAILABLE_PATHFINDERS} from "./types";

export function setAvailablePathfinders(availablePathfinders: string[]): MapTypes {
    return {
        type: SET_AVAILABLE_PATHFINDERS,
        availablePathfinders: availablePathfinders
    };
}