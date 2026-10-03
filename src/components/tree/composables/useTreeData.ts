import { computed, reactive, ref, watch } from "vue";

import {
  isArray,
  isBoolean,
  isFunction,
  isNil,
  isObject,
  isString,
} from "@me-ui/utils/types";

import { DEFAULT_FIELD_MAP } from "../tree";
import { convertDataToEntities, flattenEntities } from "../utils/treeUtil";

import type { ModelRef } from "vue";
import type {
  DataEntity,
  TreeComponentProps,
  TreeEventNodeBase,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
} from "../types";

/** useTreeData 选项 */
export interface UseTreeDataOptions {
  /** 组件 props */
  props: TreeComponentProps;
  /** 展开 key */
  expandedKeys: ModelRef<TreeKey[]>;
}

/** 懒加载根节点传入 load 回调的占位节点 */
const ROOT_EVENT_NODE: TreeEventNodeBase = {
  key: undefined,
  pos: "0",
  level: 0,
  index: 0,
  data: null,
  parent: null,
  label: "",
  disabled: false,
  isLeaf: false,
  loading: true,
};

/**
 * 树数据层（data → keyEntities → flattenNodes 管线）
 *
 * - data 为唯一数据源：实体图由 data + 内部懒加载数据 computed 重建，
 *   组件不持有可变的节点实例，也绝不修改 props.data；
 * - 懒加载 resolve 的数据写入内部 loadedChildrenMap / loadedRootData；
 * - 节点状态（展开/选中/当前等）不在这里持有，全部由 key 集合派生。
 */
export function useTreeData(options: UseTreeDataOptions) {
  const { props, expandedKeys } = options;

  /** 懒加载写入的根节点数据（props.data 为空时由 load 回调填充） */
  const loadedRootData = ref<TreeNodeData[] | null>(null);
  /** 懒加载写入的子节点数据：key → 子节点数据数组 */
  const loadedChildrenMap = reactive(new Map<TreeKey, TreeNodeData[]>());
  /** 加载中 key */
  const loadingKeys = reactive(new Set<TreeKey>());
  /** 已加载 key */
  const loadedKeys = reactive(new Set<TreeKey>());
  /** 根节点加载中（根节点是内部构造的虚拟节点，没有key，因此使用单独的变量记录根的加载状态） */
  const rootLoading = ref(false);
  /** 根节点是否已加载过 */
  const rootLoaded = ref(false);

  /** children 字段名 */
  const childrenField = computed(
    () => props.fieldMap?.children ?? DEFAULT_FIELD_MAP.children!,
  );

  /** 按 fieldMap 解析实体字段（label / disabled / isLeaf 等） */
  function getFieldValue(entity: DataEntity, prop: keyof TreeOptionProps) {
    const config = props.fieldMap?.[prop];
    const data = entity.data ?? {};
    if (isFunction(config)) {
      return config(data, entity);
    }
    if (isString(config)) {
      return data[config];
    }
    return data[prop];
  }

  /** 实体标签 */
  function getLabel(entity: DataEntity): string {
    return getFieldValue(entity, "label");
  }

  /** 实体是否禁用 */
  function getDisabled(entity: DataEntity): boolean {
    return !!getFieldValue(entity, "disabled");
  }

  /** 实体自定义类名（fieldMap.class） */
  function getClass(entity: DataEntity): string | Record<string, boolean> {
    return getFieldValue(entity, "class") ?? "";
  }

  /**
   * 实体是否为叶子：
   * - 非懒加载：无子实体即叶子；
   * - 懒加载未加载：以用户传入 isLeaf 字段为准（无该字段则视为可展开的非叶子）；
   * - 懒加载已加载：无子实体即叶子。
   */
  function isLeafEntity(entity: DataEntity): boolean {
    if (props.lazy && !loadedKeys.has(entity.key)) {
      const isLeaf = getFieldValue(entity, "isLeaf");
      return isBoolean(isLeaf) ? isLeaf : false;
    }
    return entity.children.length === 0;
  }

  /**
   * 获取实体的子节点数据：
   * data 的 children 字段为外部真实数据，懒加载 resolve 的数据作为其后追加
   */
  function getChildrenData(data: TreeNodeData | null): TreeNodeData[] {
    const children = data?.[childrenField.value];
    const defined = isArray(children) ? children : [];
    const key = data?.[props.nodeKey];
    const loaded = isNil(key) ? undefined : loadedChildrenMap.get(key);
    // 外部可能已将懒加载数据并入 children 字段，按引用去重
    return loaded?.length
      ? [...defined, ...loaded.filter((child) => !defined.includes(child))]
      : defined;
  }

  /** 根节点子数据（懒加载根数据优先于空 props.data 的兜底） */
  function getRootChildren(): TreeNodeData[] {
    const data = props.data;
    return isArray(data) && data.length
      ? data
      : (loadedRootData.value ?? []);
  }

  /**
   * 实体图：由 props.data + 懒加载数据 computed 重建。
   * 深度访问所有 children 字段，响应式数据的深层变更会自动触发重建。
   */
  const graph = computed(() =>
    convertDataToEntities(getRootChildren(), {
      keyField: props.nodeKey,
      getChildrenData,
    }),
  );

  /** key → 实体 */
  const keyEntities = computed(() => graph.value.keyEntities);

  /** 展开 key 集合 */
  const expandedKeysSet = computed(
    () => new Set<TreeKey>(expandedKeys.value),
  );

  /** 扁平可见实体 */
  const flattenNodes = computed(() =>
    flattenEntities(graph.value.topEntities, expandedKeysSet.value),
  );

  /** 懒加载根节点是否正在加载 */
  const isRootLoading = computed(
    () => Boolean(props.lazy) && rootLoading.value,
  );

  /** 是否为空（懒加载根节点加载中时不视为空） */
  const isEmpty = computed(
    () => flattenNodes.value.length === 0 && !isRootLoading.value,
  );

  // ==================== 懒加载 ====================

  /** 实体是否可进行懒加载（lazy + load + 非叶子 + 未加载过 + 未在加载中）（null 代表根节点） */
  function canLoadEntity(entity: DataEntity | null): boolean {
    if (!props.lazy || !props.load) {
      return false;
    }
    if (!entity) {
      // 根仅在无顶层实体（props.data 为空）时可加载：有初始数据时不做根追加
      return (
        !rootLoaded.value &&
        !rootLoading.value &&
        graph.value.topEntities.length === 0
      );
    }
    // 非根可以在外部已定义的基础children之上，load出后续children；叶子无需加载
    return (
      !isLeafEntity(entity) &&
      !loadedKeys.has(entity.key) &&
      !loadingKeys.has(entity.key)
    );
  }

  /** 实体是否加载中 */
  function isEntityLoading(entity: DataEntity): boolean {
    return loadingKeys.has(entity.key);
  }

  /** 创建事件节点基础信息（瞬时状态，仅供一次性消费，不含选中/展开） */
  function createEventNodeBase(entity: DataEntity | null): TreeEventNodeBase {
    if (!entity) {
      return { ...ROOT_EVENT_NODE, loading: rootLoading.value };
    }
    return {
      key: entity.key,
      pos: entity.pos,
      level: entity.level,
      index: entity.index,
      data: entity.data,
      parent: entity.parent,
      label: getLabel(entity),
      disabled: getDisabled(entity),
      isLeaf: isLeafEntity(entity),
      loading: isEntityLoading(entity),
    };
  }

  /**
   * 加载实体子节点数据（懒加载）
   * 结果写入内部 loadedChildrenMap / loadedRootData 而非 props.data，
   * 数据写入后实体图自动重建
   */
  function loadNodeData(
    entity: DataEntity | null,
    callback?: (data?: TreeNodeData[]) => void,
  ) {
    const isRoot = !entity;
    if (canLoadEntity(entity)) {
      if (isRoot) {
        rootLoading.value = true;
      } else {
        loadingKeys.add(entity!.key);
      }

      const resolve = (children?: TreeNodeData[]) => {
        if (isRoot) {
          rootLoading.value = false;
          rootLoaded.value = true;
          loadedRootData.value = children ?? [];
        } else {
          loadingKeys.delete(entity!.key);
          loadedKeys.add(entity!.key);
          // 仅保存懒加载增量，children 字段在 getChildrenData 中实时读取
          loadedChildrenMap.set(entity!.key, children ?? []);
        }
        callback?.(
          isRoot
            ? (loadedRootData.value ?? [])
            : getChildrenData(entity!.data),
        );
      };
      const reject = () => {
        if (isRoot) {
          rootLoading.value = false;
        } else {
          loadingKeys.delete(entity!.key);
        }
      };

      props.load!(createEventNodeBase(entity), resolve, reject);
    } else {
      callback?.();
    }
  }

  /** 展开实体（懒加载实体等待加载结果后再展开，一次性展示合并后的子节点） */
  function expandEntity(entity: DataEntity) {
    // 叶子实体无展开意义
    if (isLeafEntity(entity)) return;
    const done = () => {
      const list = expandedKeys.value;
      if (!list.includes(entity.key)) {
        expandedKeys.value = [...list, entity.key];
      }
    };
    // 加载中：发起方已挂回调，加载结束会自行展开，重复点击无意义
    if (isEntityLoading(entity)) return;
    if (canLoadEntity(entity)) {
      // 有内容才展开，避免空节点展开
      loadNodeData(entity, (data) => {
        if (data?.length) {
          done();
        }
      });
    } else {
      done();
    }
  }

  /** 折叠实体 */
  function collapseEntity(entity: DataEntity) {
    expandedKeys.value = expandedKeys.value.filter(
      (key) => key !== entity.key,
    );
  }

  /** 获取实体 */
  function getEntity(
    data: TreeKey | TreeNodeData | DataEntity,
  ): DataEntity | null {
    if (isEntity(data)) {
      return data;
    }
    const key = isObject(data) ? data?.[props.nodeKey] : data;
    return isNil(key) ? null : (keyEntities.value.get(key) ?? null);
  }

  /** 判断是否为实体 */
  function isEntity(value: unknown): value is DataEntity {
    return isObject(value) && graph.value.entitySet.has(value as DataEntity);
  }

  /** 懒加载 + 无初始数据时，进行根节点首次加载 */
  watch(
    [graph, () => props.lazy],
    () => {
      if (canLoadEntity(null)) {
        loadNodeData(null);
      }
    },
    { immediate: true },
  );

  /** 实体图重建后，清理已不在图中的懒加载状态，避免陈旧数据复活 */
  watch(graph, (g) => {
    for (const key of [...loadedChildrenMap.keys()]) {
      if (!g.keyEntities.has(key)) loadedChildrenMap.delete(key);
    }
    for (const key of [...loadedKeys]) {
      if (!g.keyEntities.has(key)) loadedKeys.delete(key);
    }
    for (const key of [...loadingKeys]) {
      if (!g.keyEntities.has(key)) loadingKeys.delete(key);
    }
  });

  return {
    graph,
    keyEntities,
    expandedKeysSet,
    flattenNodes,
    isEmpty,
    isRootLoading,
    loadingKeys,
    loadedKeys,
    getLabel,
    getDisabled,
    getClass,
    isLeafEntity,
    canLoadEntity,
    createEventNodeBase,
    loadNodeData,
    expandEntity,
    collapseEntity,
    getEntity,
  };
}
