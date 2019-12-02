/**
 * This class represents a single search node in the exploration tree for
 * A* algorithm.
 *
 * @param {Object} node  original node in the graph
 */
import { Node } from 'ngraph.graph';

interface NodeSearchState {
    node: Node,
    parent: NodeSearchState | null,
    closed: boolean,
    open: number,
    distanceToSource: number,
    fScore: number,
    heapIndex: number,
}

function NodeSearchStateConstructor(node: Node) {
    let nodeSearchState: NodeSearchState = {
        node: node,

        // How we came to this node?
        parent: null,
        closed: false,
        open: 0,
        distanceToSource: Number.POSITIVE_INFINITY,
        // the f(n) = g(n) + h(n) value
        fScore: Number.POSITIVE_INFINITY,
        // used to reconstruct heap when fScore is updated.
        heapIndex: -1
    };

    return nodeSearchState
}

export default function makeSearchStatePool() {
    let currentInCache = 0;
    let nodeCache: NodeSearchState[] = [];

    return {
        createNewState: createNewState,
        reset: reset
    };

    function reset() {
        currentInCache = 0;
    }

    function createNewState(node: Node) {
        let cached = nodeCache[currentInCache];
        if (cached) {
            cached.node = node;
            // How we came to this node?
            cached.parent = null;

            cached.closed = false;
            cached.open = 0;

            cached.distanceToSource = Number.POSITIVE_INFINITY;
            // the f(n) = g(n) + h(n) value
            cached.fScore = Number.POSITIVE_INFINITY;

            // used to reconstruct heap when fScore is updated.
            cached.heapIndex = -1;

        } else {
            cached = NodeSearchStateConstructor(node);
            nodeCache[currentInCache] = cached;
        }
        currentInCache++;
        return cached;
    }
}