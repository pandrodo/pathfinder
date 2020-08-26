import defaultSettings from "./defaultSettings";
import makeSearchStatePool from "./makeSearchStatePool";
import NodeHeap from "./NodeHeap";

import { Graph } from 'ngraph.graph';

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
    parent: NodeSearchState | null,
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

function aStarPathSearch(graph: Graph, options: PathfinderOptions) {
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
        let from = graph.getNode(fromId);
        if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
        let to = graph.getNode(toId);
        if (!to) throw new Error('toId is not defined in this graph: ' + toId);
        pool.reset();

        // Maps nodeId to NodeSearchState.
        let nodeState = new Map();

        // the nodes that we still need to evaluate
        let openSet = NodeHeap([],{
            compare: defaultSettings.compareFScore,
            setNodeId: defaultSettings.setHeapIndex
        });

        let startNode = pool.createNewState(from);
        nodeState.set(Number(fromId), startNode);

        // For the first node, fScore is completely heuristic.
        startNode.fScore = heuristic(from, to);

        // The cost of going from start to start is zero.
        startNode.distanceToSource = 0;
        openSet.push(startNode);
        startNode.open = 1;

        let cameFrom: NodeSearchState;

        while (openSet.length > 0) {
            // Количество вершин, которые обошел агоритм
            // console.log(`States in map: ${nodeState.size}`);

            // Расчет количества уникальных ребер, соединенных с этими вершинами
            // let links: string[] = [];
            // nodeState.forEach(function (entry) {
            //     entry.node.links.forEach(function (link: Link) {
            //         if(!links.includes(link.id)) {
            //             links.push(link.id);
            //         }
            //     });
            // });
            // console.log(`Links in map: ${links.length}`);

            cameFrom = openSet.pop();

            if (goalReached(cameFrom, to)) return reconstructPath(cameFrom);

            // no need to visit this node anymore
            cameFrom.closed = true;
            graph.forEachLinkedNode(cameFrom.node.id, visitNeighbour, oriented);
        }

        // If we got here, then there is no path.
        return NO_PATH;

        function visitNeighbour(otherNode: Node) {
            let otherSearchState = nodeState.get(otherNode.id);
            if (!otherSearchState) {
                otherSearchState = pool.createNewState(otherNode);
                nodeState.set(otherNode.id, otherSearchState);
            }

            if (otherSearchState.closed) {
                // Already processed this node.
                return;
            }
            if (otherSearchState.open === 0) {
                // Remember this node.
                openSet.push(otherSearchState);
                otherSearchState.open = 1;
            }

            let tentativeDistance = cameFrom.distanceToSource + distance(otherNode, cameFrom.node);
            if (tentativeDistance >= otherSearchState.distanceToSource) {
                // This would only make our path longer. Ignore this route.
                return;
            }

            // bingo! we found shorter path:
            otherSearchState.parent = cameFrom;
            otherSearchState.distanceToSource = tentativeDistance;
            if(to) {
                otherSearchState.fScore = tentativeDistance + heuristic(otherSearchState.node, to);
            }

            openSet.updateItem(otherSearchState.heapIndex);
        }
    }
}

function goalReached(searchState: NodeSearchState, targetNode: Node) {
    return searchState.node === targetNode;
}

function reconstructPath(searchState: NodeSearchState) {
    let path = [searchState.node];
    let parent = searchState.parent;

    while (parent) {
        path.push(parent.node);
        parent = parent.parent;
    }

    return path;
}

export default aStarPathSearch;