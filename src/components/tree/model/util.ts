import Node from './node';

/** 判断是否为 Node 实例 */
export function isNode(child: unknown): child is Node {
  return child instanceof Node;
}
