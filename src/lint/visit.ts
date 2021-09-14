// import { Node, NodeName, children, Visitor } from "./node";

// export function visit(initialNode: Node, v: Visitor) {
//   let queue: Node[] = [];
//   let node: Node = initialNode;
//   while (node) {
//     const name = Object.keys(node)[0] as NodeName;
//     if (v[name]) {
//       // This line does weird stuff to TS, asserting to any
//       // fixes that
//       (v as any)[name as any](node);
//     }
//     queue = queue.concat(children(node));
//     node = queue[0];
//     queue = queue.slice(1);
//   }
// }
