import defaultSettings from "./defaultSettings";
import makeSearchStatePool from "./makeSearchStatePool";
import NodeHeap from "./NodeHeap";

import { Graph } from 'ngraph.graph';
import React from "react";

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
        let nodes = new Map();
        nodes.set(5998899980, 1);
        nodes.set(5998899981, 2);
        nodes.set(5998899975, 3);
        nodes.set(5998899976, 4);
        nodes.set(5998899977, 5);
        nodes.set(5998899978, 6);
        nodes.set(5998899979, 7);
        nodes.set(5998899974, 8);
        console.log('======START=====');
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
            // console.log(`OPEN SET CONTAINS: `);
            // openSet.data.forEach(element => console.log(nodes.get(element.node.id)));
            // console.log(`ELEMENTS`);
            cameFrom = openSet.pop();
            // console.log(`Current node ${nodes.get(cameFrom.node.id)} with distance to source ${cameFrom.distanceToSource} and heuristic ${heuristic(cameFrom.node, to)}`);
            console.log(`Current node ${nodes.get(cameFrom.node.id)}`);
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
                console.log(`${nodes.get(otherSearchState.node.id)} - ${nodes.get(cameFrom.node.id)} already processed`);
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
                console.log(`${nodes.get(otherSearchState.node.id)} - ${nodes.get(cameFrom.node.id)} make our path only longer`);
                return;
            }

            // bingo! we found shorter path:
            otherSearchState.parent = cameFrom;
            otherSearchState.distanceToSource = tentativeDistance;
            if(to) {
                console.log(`Visiting node ${nodes.get(otherNode.id)} with distance to source ${Math.round(otherSearchState.distanceToSource)} and heuristic ${Math.round(heuristic(otherSearchState.node, to))}`);
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
    console.log('======END=====');
    let path = [searchState.node];
    let parent = searchState.parent;

    while (parent) {
        path.push(parent.node);
        parent = parent.parent;
    }

    return path;
}

export default aStarPathSearch;