// We reuse instance of array, but we trie to freeze it as well,
// so that consumers don't modify it. Maybe it's a bad idea.
// var NO_PATH = [];
// if (typeof Object.freeze === 'function') Object.freeze(NO_PATH);
//
// module.exports = {
//     // Path search settings
//     heuristic: blindHeuristic,
//     distance: constantDistance,
//     compareFScore: compareFScore,
//     NO_PATH: NO_PATH,
//
//     // heap settings
//     setHeapIndex: setHeapIndex,
//
//     // nba:
//     setH1: setH1,
//     setH2: setH2,
//     compareF1Score: compareF1Score,
//     compareF2Score: compareF2Score,
// }

// this.node = node;
//
// // How we came to this node?
// this.parent = null;
//
// this.closed = false;
// this.open = 0;
//
// this.distanceToSource = Number.POSITIVE_INFINITY;
// // the f(n) = g(n) + h(n) value
// this.fScore = Number.POSITIVE_INFINITY;
//
// // used to reconstruct heap when fScore is updated.
// this.heapIndex = -1;

import {Node} from 'ngraph.graph';

interface NodeSearchState {
    node: Node,
    parent: NodeSearchState,
    closed: boolean,
    open: number,
    distanceToSource: number,
    fScore: number,
    heapIndex: number,
}

const defaultSettings = {
    // Path search settings
    heuristic: blindHeuristic,
    distance: constantDistance,
    compareFScore: compareFScore,
    NO_PATH: [],

    // heap settings
    setHeapIndex: setHeapIndex,
};

function blindHeuristic(/* a, b */) {
    // blind heuristic makes this search equal to plain Dijkstra path search.
    return 0;
}

function constantDistance(/* a, b */) {
    return 1;
}

function compareFScore(a: NodeSearchState, b: NodeSearchState) {
    // TODO: Can I improve speed with smarter ties-breaking?
    // I tried distanceToSource, but it didn't seem to have much effect
    return a.fScore - b.fScore;
}

function setHeapIndex(nodeSearchState: NodeSearchState, heapIndex: number) {
    nodeSearchState.heapIndex = heapIndex;
}

// function compareF1Score(a, b) {
//     return a.f1 - b.f1;
// }
//
// function compareF2Score(a, b) {
//     return a.f2 - b.f2;
// }
//
// function setH1(node, heapIndex) {
//     node.h1 = heapIndex;
// }
//
// function setH2(node, heapIndex) {
//     node.h2 = heapIndex;
// }

export default defaultSettings;