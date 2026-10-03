import { isNil } from "@me-ui/utils/types";

import type {
  DataEntity,
  EntityGraph,
  TreeKey,
  TreeNodeData,
} from "../types";

/** 判断两个 key 集合是否相同 */
export function isSameKeySet(a: Set<TreeKey>, b: Set<TreeKey>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

/**
 * 将树形数据转换为实体图
 *
 * @param rootChildren 顶层节点数据
 * @param options.keyField 节点 key 字段名
 * @param options.getChildrenData 取子节点数据（可融合懒加载数据等）
 */
export function convertDataToEntities(
  rootChildren: TreeNodeData[],
  options: {
    keyField: string;
    getChildrenData?: (data: TreeNodeData) => TreeNodeData[];
  },
): EntityGraph {
  const { keyField, getChildrenData } = options;
  const entities: DataEntity[] = [];
  const keyEntities = new Map<TreeKey, DataEntity>();
  const levelEntities = new Map<number, Set<DataEntity>>();
  let maxLevel = 0;

  const dig = (
    list: TreeNodeData[],
    parent: DataEntity | null,
    parentPos: string,
  ): DataEntity[] => {
    const result: DataEntity[] = [];
    list.forEach((data, index) => {
      const entity: DataEntity = {
        key: data?.[keyField],
        pos: `${parentPos}-${index}`,
        level: parent ? parent.level + 1 : 1,
        index,
        data,
        parent,
        siblings: result,
        children: [],
      };
      entities.push(entity);
      if (!isNil(entity.key)) {
        keyEntities.set(entity.key, entity);
      }
      let levelSet = levelEntities.get(entity.level);
      if (!levelSet) {
        levelSet = new Set();
        levelEntities.set(entity.level, levelSet);
      }
      levelSet.add(entity);
      maxLevel = Math.max(maxLevel, entity.level);

      const children = getChildrenData ? getChildrenData(data) : [];
      if (children.length) {
        entity.children = dig(children, entity, entity.pos);
      }
      result.push(entity);
    });
    return result;
  };

  const topEntities = dig(rootChildren ?? [], null, "0");
  return {
    entities,
    entitySet: new Set(entities),
    topEntities,
    keyEntities,
    levelEntities,
    maxLevel,
  };
}

/**
 * 按展开集合扁平化可见节点
 */
export function flattenEntities(
  topEntities: DataEntity[],
  expandedKeysSet: Set<TreeKey>,
): DataEntity[] {
  const result: DataEntity[] = [];
  const stack: DataEntity[] = [];
  for (let i = topEntities.length - 1; i >= 0; i--) {
    stack.push(topEntities[i]);
  }
  while (stack.length) {
    const entity = stack.pop()!;
    result.push(entity);
    if (expandedKeysSet.has(entity.key) && entity.children.length) {
      for (let i = entity.children.length - 1; i >= 0; i--) {
        stack.push(entity.children[i]);
      }
    }
  }
  return result;
}

/**
 * 展开状态向上传导：
 * 返回 keyList 及其所有祖先 key 的并集，遇 disabled 祖先停止向上。
 */
export function conductExpandParent(
  keyList: TreeKey[] | undefined,
  keyEntities: Map<TreeKey, DataEntity>,
  getDisabled: (entity: DataEntity) => boolean,
): TreeKey[] {
  const expandedKeys = new Set<TreeKey>();

  for (const key of keyList ?? []) {
    let entity = keyEntities.get(key);
    while (entity && !expandedKeys.has(entity.key)) {
      expandedKeys.add(entity.key);
      if (getDisabled(entity)) break;
      entity = isNil(entity.parent?.key) ? undefined : entity.parent;
    }
  }

  return [...expandedKeys];
}

/** 下一个同级实体 */
export function getNextSibling(entity: DataEntity): DataEntity | null {
  return entity.index < entity.siblings.length - 1
    ? entity.siblings[entity.index + 1]
    : null;
}

/** 上一个同级实体 */
export function getPreviousSibling(entity: DataEntity): DataEntity | null {
  return entity.index > 0 ? entity.siblings[entity.index - 1] : null;
}

/** 实体是否包含目标实体 */
export function entityContains(
  entity: DataEntity,
  target: DataEntity,
  deep = true,
): boolean {
  return entity.children.some(
    (child) => child === target || (deep && entityContains(child, target)),
  );
}

/** 获取实体的祖先实体列表（自近及远，不含自身与虚拟根节点） */
export function getAncestorEntities(entity: DataEntity): DataEntity[] {
  const ancestors: DataEntity[] = [];
  let parent = entity.parent;
  while (parent) {
    ancestors.push(parent);
    parent = parent.parent;
  }
  return ancestors;
}
