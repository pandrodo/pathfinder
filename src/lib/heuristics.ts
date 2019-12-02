// module.exports = {
//     l2: l2,
//     l1: l1
// };
//
// /**
//  * Euclid distance (l2 norm);
//  *
//  * @param {*} a
//  * @param {*} b
//  */
// function l2(a, b) {
//     var dx = a.x - b.x;
//     var dy = a.y - b.y;
//     return Math.sqrt(dx * dx + dy * dy);
// }
//
// /**
//  * Manhattan distance (l1 norm);
//  * @param {*} a
//  * @param {*} b
//  */
// function l1(a, b) {
//     var dx = a.x - b.x;
//     var dy = a.y - b.y;
//     return Math.abs(dx) + Math.abs(dy);
// }

interface Node {
    x: number;
    y: number;
}

export function l2(a: Node, b: Node): number {
    let dx = a.x - b.x;
    let dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
}

export function l1(a: Node, b: Node): number {
    let dx = a.x - b.x;
    let dy = a.y - b.y;

    return Math.abs(dx) + Math.abs(dy);
}