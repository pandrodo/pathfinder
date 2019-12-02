import defaultSettings from "./defaultSettings";
import makeSearchStatePool from "./makeSearchStatePool";
import NodeHeap from "./NodeHeap";

import { Graph } from 'ngraph.graph';

const BY_FROM = 1;
const BY_TO = 2;
const NO_PATH = defaultSettings.NO_PATH;

type NodeId = string | number

interface Link<Data = any> {
    id: string,
    fromId: NodeId,
    toId: NodeId,
    data: Data
}

interface Node<Data = any> {
    id: NodeId,
    links: Link[],
    data: Data
}

interface NodeSearchState {
    node: Node,
    parent: NodeSearchState,
    closed: boolean,
    open: number,
    distanceToSource: number,
    fScore: number,
    heapIndex: number,
}

interface PathfinderOptions {
    oriented?: boolean,
    distance(a: Node, b: Node): number,
    heuristic(a: Node, b: Node): number
}

function aGreedy(graph: Graph, options: PathfinderOptions) {
    options = options || {};
    // whether traversal should be considered over oriented graph.
    const oriented = options.oriented || false;

    let heuristic = options.heuristic;
    if (!heuristic) heuristic = defaultSettings.heuristic;

    let distance = options.distance;
    if (!distance) distance = defaultSettings.distance;
    let pool = makeSearchStatePool();

    return {
        find: find
    };

    function find(fromId: NodeId, toId: NodeId) {
        // Not sure if we should return NO_PATH or throw. Throw seem to be more
        // helpful to debug errors. So, throwing.
        let from = graph.getNode(fromId);
        if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
        let to = graph.getNode(toId);
        if (!to) throw new Error('toId is not defined in this graph: ' + toId);

        if (from === to) return [from]; // trivial case.

        pool.reset();

        let callVisitor = oriented ? orientedVisitor : nonOrientedVisitor;

        // Maps nodeId to NodeSearchState.
        let nodeState = new Map();

        let openSetFrom = NodeHeap([], {
            compare: defaultSettings.compareFScore,
            setNodeId: defaultSettings.setHeapIndex
        });

        let openSetTo = NodeHeap([], {
            compare: defaultSettings.compareFScore,
            setNodeId: defaultSettings.setHeapIndex
        });

        let startNode = pool.createNewState(from);
        nodeState.set(fromId, startNode);

        // For the first node, fScore is completely heuristic.
        startNode.fScore = heuristic(from, to);
        // The cost of going from start to start is zero.
        startNode.distanceToSource = 0;
        openSetFrom.push(startNode);
        startNode.open = BY_FROM;

        let endNode = pool.createNewState(to);
        endNode.fScore = heuristic(to, from);
        endNode.distanceToSource = 0;
        openSetTo.push(endNode);
        endNode.open = BY_TO;

        // Cost of the best solution found so far. Used for accurate termination
        let lMin = Number.POSITIVE_INFINITY;
        let minFrom: NodeSearchState, minTo: NodeSearchState;

        let currentSet = openSetFrom;
        let currentOpener = BY_FROM;

        let current: NodeSearchState;

        while (openSetFrom.length > 0 && openSetTo.length > 0) {
            if (openSetFrom.length < openSetTo.length) {
                // we pick a set with less elements
                currentOpener = BY_FROM;
                currentSet = openSetFrom;
            } else {
                currentOpener = BY_TO;
                currentSet = openSetTo;
            }

            current = currentSet.pop();

            // no need to visit this node anymore
            current.closed = true;

            if (current.distanceToSource > lMin) continue;

            graph.forEachLinkedNode(current.node.id, callVisitor, oriented);

            // @ts-ignore
            if (minFrom && minTo) {
                // This is not necessary the best path, but we are so greedy that we
                // can't resist:
                return reconstructBiDirectionalPath(minFrom, minTo);
            }
        }

        return NO_PATH; // No path.

        function nonOrientedVisitor(otherNode: Node, link: Link) {
            return visitNode(otherNode, link, current);
        }

        function orientedVisitor(otherNode: Node, link: Link) {
            // For oriented graphs we need to reverse graph, when traveling
            // backwards. So, we use non-oriented ngraph traversal, and
            // filter link orientation here.
            if (currentOpener === BY_FROM) {
                if (link.fromId === current.node.id) return visitNode(otherNode, link, current)
            } else if (currentOpener === BY_TO) {
                if (link.toId === current.node.id) return visitNode(otherNode, link, current);
            }
        }

        function canExit(currentNode: NodeSearchState) {
            let opener = currentNode.open;
            return !!(opener && opener !== currentOpener);
        }

        function reconstructBiDirectionalPath(a: NodeSearchState, b: NodeSearchState) {
            let pathOfNodes = [];
            let aParent = a;
            while(aParent) {
                pathOfNodes.push(aParent.node);
                aParent = aParent.parent;
            }
            let bParent = b;
            while (bParent) {
                pathOfNodes.unshift(bParent.node);
                bParent = bParent.parent
            }
            return pathOfNodes;
        }

        function visitNode(otherNode: Node, link: Link, cameFrom: NodeSearchState) {
            let otherSearchState = nodeState.get(otherNode.id);
            if (!otherSearchState) {
                otherSearchState = pool.createNewState(otherNode);
                nodeState.set(otherNode.id, otherSearchState);
            }

            if (otherSearchState.closed) {
                // Already processed this node.
                return;
            }

            if (canExit(otherSearchState)) {
                // this node was opened by alternative opener. The sets intersect now,
                // we found an optimal path, that goes through *this* node. However, there
                // is no guarantee that this is the global optimal solution path.

                let potentialLMin = otherSearchState.distanceToSource + cameFrom.distanceToSource;
                if (potentialLMin < lMin) {
                    minFrom = otherSearchState;
                    minTo = cameFrom;
                    lMin = potentialLMin;
                }
                // we are done with this node.
                return;
            }

            let tentativeDistance = cameFrom.distanceToSource + distance(otherSearchState.node, cameFrom.node);

            if (tentativeDistance >= otherSearchState.distanceToSource) {
                // This would only make our path longer. Ignore this route.
                return;
            }

            // Choose target based on current working set:
            if (to && from) {
                let target = (currentOpener === BY_FROM) ? to : from;
                let newFScore = tentativeDistance + heuristic(otherSearchState.node, target);

                if (newFScore >= lMin) {
                    // this can't be optimal path, as we have already found a shorter path.
                    return;
                }
                otherSearchState.fScore = newFScore;
            }

            if (otherSearchState.open === 0) {
                // Remember this node in the current set
                currentSet.push(otherSearchState);
                currentSet.updateItem(otherSearchState.heapIndex);

                otherSearchState.open = currentOpener;
            }

            // bingo! we found shorter path:
            otherSearchState.parent = cameFrom;
            otherSearchState.distanceToSource = tentativeDistance;
        }
    }
}

export default aGreedy;