import {Node} from "ngraph.graph";

/**
 * Based on https://github.com/mourner/tinyqueue
 * Copyright (c) 2017, Vladimir Agafonkin https://github.com/mourner/tinyqueue/blob/master/LICENSE
 *
 * Adapted for PathFinding needs by @anvaka
 * Copyright (c) 2017, Andrei Kashcha
 */
interface NodeSearchState {
    node: Node,
    parent: NodeSearchState | null,
    closed: boolean,
    open: number,
    distanceToSource: number,
    fScore: number,
    heapIndex: number,
}

interface NodeHeapOptions {
    compare(a: NodeSearchState, b: NodeSearchState): number,
    setNodeId(nodeSearchState: NodeSearchState, heapIndex: number): any
}

interface NodeHeap {
    data: NodeSearchState[],
    length: number,
    compare(a: NodeSearchState, b: NodeSearchState): number,
    setNodeId(nodeSearchState: NodeSearchState, heapIndex: number): any,
    push(item: NodeSearchState): any,
    pop(): any,
    peek(): any,
    updateItem(pos: number): any,
    _up(pos: number): any,
    _down(pos: number): any
}

export default function NodeHeap(data: NodeSearchState[], options: NodeHeapOptions) {
    // if (!(this instanceof NodeHeap)) return new NodeHeap(data, options);

    if (!Array.isArray(data)) {
        // assume first argument is our config object;
        options = data;
        data = [];
    }

    options = options || {};

    let nodeHeap: NodeHeap = {
        data: data || [],
        length: data.length,
        compare: options.compare || defaultCompare,
        setNodeId: options.setNodeId || noop,
        push: push,
        pop: pop,
        peek: peek,
        updateItem: updateItem,
        _up: _up,
        _down: _down
    };

    if (nodeHeap.length > 0) {
        for (let i = (nodeHeap.length >> 1); i >= 0; i--) nodeHeap._down(i);
    }

    if (options.setNodeId) {
        for (let i = 0; i < nodeHeap.length; ++i) {
            nodeHeap.setNodeId(nodeHeap.data[i], i);
        }
    }

    function push(item: NodeSearchState) {
        nodeHeap.data.push(item);
        nodeHeap.setNodeId(item, nodeHeap.length);
        nodeHeap.length++;
        nodeHeap._up(nodeHeap.length - 1);
    }

    function pop() {
        if (nodeHeap.length === 0) return undefined;

        let top = nodeHeap.data[0];
        nodeHeap.length--;

        if (nodeHeap.length > 0) {
            nodeHeap.data[0] = nodeHeap.data[nodeHeap.length];
            nodeHeap.setNodeId(nodeHeap.data[0], 0);
            nodeHeap._down(0);
        }
        nodeHeap.data.pop();

        return top;
    }

    function peek() {
        return nodeHeap.data[0];
    }

    function updateItem(pos: number) {
        nodeHeap._up(pos);
        nodeHeap._down(pos);
    }

    function _up (pos: number) {
        let data = nodeHeap.data;
        let compare = nodeHeap.compare;
        let setNodeId = nodeHeap.setNodeId;
        let item = data[pos];

        while (pos > 0) {
            let parent = (pos - 1) >> 1;
            let current = data[parent];
            if (compare(item, current) >= 0) break;
            data[pos] = current;

            setNodeId(current, pos);
            pos = parent;
        }

        data[pos] = item;
        setNodeId(item, pos);
    }

    function _down(pos: number) {
        let data = nodeHeap.data;
        let compare = nodeHeap.compare;
        let halfLength = nodeHeap.length >> 1;
        let item = data[pos];
        let setNodeId = nodeHeap.setNodeId;

        while (pos < halfLength) {
            let left = (pos << 1) + 1;
            let right = left + 1;
            let best = data[left];

            if (right < nodeHeap.length && compare(data[right], best) < 0) {
                left = right;
                best = data[right];
            }
            if (compare(best, item) >= 0) break;

            data[pos] = best;
            setNodeId(best, pos);
            pos = left;
        }

        data[pos] = item;
        setNodeId(item, pos);
    }

    return nodeHeap;
}

function noop() {}

function defaultCompare(a: number, b: number) {
    return a - b;
}