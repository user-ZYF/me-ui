import { isNil } from "@me-ui/utils/types";

import type { DataEntity, EntityGraph, TreeKey } from "../types";

/** 判断实体是否禁止勾选（disabled 实体不参与勾选传导） */
export type GetCheckDisabled = (entity: DataEntity) => boolean;

/** 实体是否可作为传导父级（排除无 key 的顶层占位） */
function isConductableParent(
  entity: DataEntity | null | undefined,
): entity is DataEntity {
  return !!entity && !isNil(entity.key);
}

/**
 * 向下传导：沿目标实体的子树更新勾选
 * - 勾选：所有未禁用后代选中
 * - 取消：所有未禁用后代取消选中
 * 禁用或无 key 的实体连同其子树整体跳过
 */
function conductDown(
  entity: DataEntity,
  checked: boolean,
  checkedKeys: Set<TreeKey>,
  getCheckDisabled: GetCheckDisabled,
) {
  const stack = [...entity.children];
  while (stack.length) {
    const child = stack.pop()!;
    if (getCheckDisabled(child) || isNil(child.key)) continue;
    if (checked) checkedKeys.add(child.key);
    else checkedKeys.delete(child.key);
    stack.push(...child.children);
  }
}

/**
 * 向上传导：沿父链逐层重算祖先勾选状态
 * - 勾选：全部可选子实体均选中 → 祖先选中（部分选中不改动祖先）
 * - 取消：存在未选中的可选子实体 → 祖先取消选中
 */
function conductUp(
  entity: DataEntity,
  checked: boolean,
  checkedKeys: Set<TreeKey>,
  getCheckDisabled: GetCheckDisabled,
) {
  let parent = entity.parent;
  while (isConductableParent(parent)) {
    // 父实体禁用则不再向上传导
    if (getCheckDisabled(parent)) break;

    let allChecked = true;
    for (const child of parent.children) {
      if (getCheckDisabled(child)) continue;
      if (!checkedKeys.has(child.key)) {
        allChecked = false;
        break;
      }
    }

    if (allChecked) checkedKeys.add(parent.key);
    else if (!checked) checkedKeys.delete(parent.key);

    parent = parent.parent;
  }
}

/**
 * 勾选传导（增量）：仅围绕变化的 key 更新选中集合
 * - 对每个变化实体：自身更新 → 子树传导 → 父链修正
 * - 未注册（懒加载未加载）的 key 仅更新集合本身，等待实体创建后生效
 * @param changedKeys 本次变化的 key（勾选传待选中项，取消传待取消项）
 * @param checked `true` 为勾选；`false` 为取消勾选
 * @param currentChecked 当前选中 key 集合
 * @param entities 实体图
 * @param getCheckDisabled 禁用判断（由调用方按 fieldMap 解析）
 * @returns 传导后的完整选中 key 列表
 */
export function conductCheck(
  changedKeys: Iterable<TreeKey>,
  checked: boolean,
  currentChecked: Iterable<TreeKey>,
  entities: EntityGraph,
  getCheckDisabled: GetCheckDisabled,
): TreeKey[] {
  const checkedKeys = new Set<TreeKey>(currentChecked);

  for (const key of changedKeys) {
    if (checked) checkedKeys.add(key);
    else checkedKeys.delete(key);

    const entity = entities.keyEntities.get(key);
    if (!entity) continue;

    conductDown(entity, checked, checkedKeys, getCheckDisabled);
    conductUp(entity, checked, checkedKeys, getCheckDisabled);
  }

  return [...checkedKeys];
}
