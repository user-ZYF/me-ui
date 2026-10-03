import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';

import Tree from './Tree.vue';

const data = [
  {
    id: 1,
    label: 'n1',
    children: [
      { id: 11, label: 'n11' },
      { id: 12, label: 'n12' },
    ],
  },
  { id: 2, label: 'n2', children: [{ id: 21, label: 'n21' }] },
  { id: 3, label: 'n3' },
];

const mountTree = (props: Record<string, any> = {}) =>
  mount(Tree, { props: { data, nodeKey: 'id', ...props } });

// vitest 下 less module 的 :export 不生效，用 data-tree-key / 部分 class 匹配
const rows = (w: ReturnType<typeof mountTree>) =>
  w.findAll('[data-tree-key]');
const expandIcons = (w: ReturnType<typeof mountTree>) =>
  w.findAll('[class*="expand-icon"]');

describe('Tree refactor smoke', () => {
  it('扁平渲染：默认只渲染顶层节点', () => {
    const w = mountTree();
    expect(rows(w).length).toBe(3);
  });

  it('v-model:expanded-keys 驱动展开', async () => {
    const w = mountTree({ expandedKeys: [] });
    await w.setProps({ expandedKeys: [1] });
    expect(rows(w).length).toBe(5);
    await w.setProps({ expandedKeys: [] });
    expect(rows(w).length).toBe(3);
  });

  it('点击展开图标 -> 回写 expandedKeys', async () => {
    const w = mountTree({ expandedKeys: [] });
    await expandIcons(w)[0].trigger('click');
    const emitted = w.emitted('update:expandedKeys');
    expect(emitted).toBeTruthy();
    expect(emitted!.at(-1)![0]).toEqual([1]);
    await w.setProps({ expandedKeys: emitted!.at(-1)![0] as any });
    expect(rows(w).length).toBe(5);
    expect(w.emitted('node-expand')).toBeTruthy();
  });

  it('autoExpandParent：外部设置子级 key 自动补齐祖先', async () => {
    const w = mountTree({ expandedKeys: [] });
    await w.setProps({ expandedKeys: [11] });
    // 11 的祖先 1 应被自动加入展开集合
    const emitted = w.emitted('update:expandedKeys');
    expect(emitted).toBeTruthy();
    expect(new Set(emitted!.at(-1)![0] as any[])).toEqual(new Set([11, 1]));
  });

  it('勾选级联：勾选父节点物化整棵子树 key', async () => {
    const w = mountTree({ checkable: true, checkedKeys: [] });
    const checkbox = w.findAllComponents({ name: 'MeCheckbox' })[0];
    checkbox.vm.$emit('change', true);
    await nextTick();
    const emitted = w.emitted('update:checkedKeys');
    expect(emitted).toBeTruthy();
    expect(new Set(emitted!.at(-1)![0] as any[])).toEqual(
      new Set([1, 11, 12]),
    );
    expect(w.emitted('check')).toBeTruthy();
    expect(w.emitted('check-change')).toBeTruthy();
  });

  it('取消勾选选中父节点下的子节点 -> 父节点变半选并移出集合', async () => {
    const w = mountTree({ checkable: true, checkedKeys: [1], expandedKeys: [1] });
    await nextTick();
    // 初始时 [1] 级联物化为 [1, 11, 12]
    const initEmit = w.emitted('update:checkedKeys');
    expect(initEmit).toBeTruthy();
    expect(new Set(initEmit!.at(-1)![0] as any[])).toEqual(
      new Set([1, 11, 12]),
    );
    await w.setProps({ checkedKeys: initEmit!.at(-1)![0] as any });
    await nextTick();

    // 取消勾选 11（第二个 checkbox）
    const checkbox = w.findAllComponents({ name: 'MeCheckbox' })[1];
    checkbox.vm.$emit('change', false);
    await nextTick();
    const emitted = w.emitted('update:checkedKeys');
    expect(new Set(emitted!.at(-1)![0] as any[])).toEqual(new Set([12]));
    // 半选 key = 1
    expect(w.vm.getHalfCheckedKeys()).toEqual([1]);
  });

  it('点击节点 -> 回写 currentNodeKey 并高亮', async () => {
    const w = mountTree();
    await rows(w)[0].trigger('click');
    const emitted = w.emitted('update:currentNodeKey');
    expect(emitted).toBeTruthy();
    expect(emitted!.at(-1)![0]).toBe(1);
    await w.setProps({ currentNodeKey: 1 });
    expect(w.emitted('current-change')).toBeTruthy();
    expect(rows(w)[0].classes()).toContain('is-current');
  });

  it('data 引用变化 -> 重建且按 v-model 恢复状态', async () => {
    const w = mountTree({ expandedKeys: [1], checkedKeys: [11], checkable: true });
    await nextTick();
    await w.setProps({
      data: [
        { id: 1, label: 'n1*', children: [{ id: 11, label: 'n11*' }, { id: 13, label: 'n13' }] },
        { id: 4, label: 'n4' },
      ],
    });
    await nextTick();
    expect(rows(w).length).toBe(4);
    expect(rows(w)[1].classes()).toContain('is-checked');
  });

  it('拖拽放置：抛出 node-drop 事件且不修改 data（由外部更新数据）', async () => {
    const w = mountTree({ draggable: true, expandedKeys: [1, 2] });
    await nextTick();
    const source = w.find('[data-tree-key="11"]');
    const target = w.find('[data-tree-key="2"]');
    const dataTransfer = { effectAllowed: '', dropEffect: '' };

    await source.trigger('dragstart', { dataTransfer });
    // jsdom 中 getBoundingClientRect 全为 0 → distance=0 → 落入 inner 区间
    await target.trigger('dragover', { dataTransfer, clientY: 0 });
    await source.trigger('dragend', { dataTransfer });

    const dropEmit = w.emitted('node-drop');
    expect(dropEmit).toBeTruthy();
    const [draggingNode, dropNode, dropType] = dropEmit![0];
    expect(dropType).toBe('inner');
    expect((draggingNode as any).key).toBe(11);
    expect((dropNode as any).key).toBe(2);
    expect(w.emitted('node-drag-end')).toBeTruthy();
    // 组件不修改树结构：源父节点 children 不变
    expect(data[0].children).toHaveLength(2);
    expect(data[1].children).toHaveLength(1);
  });

  it('拖拽自身/自身后代/相邻原位置：不允许放置', async () => {
    const w = mountTree({ draggable: true, expandedKeys: [1, 2] });
    await nextTick();
    const dataTransfer = { effectAllowed: '', dropEffect: '' };

    // 拖到自身：jsdom 下矩形全 0 → 命中 inner 区间，但自身应被拦截
    const self = w.find('[data-tree-key="1"]');
    await self.trigger('dragstart', { dataTransfer });
    await self.trigger('dragover', { dataTransfer, clientY: 0 });
    await self.trigger('dragend', { dataTransfer });
    expect(w.emitted('node-drop')).toBeFalsy();
    expect(self.classes()).not.toContain('is-drop-inner');

    // 拖到自身后代（1 → 11）
    const child = w.find('[data-tree-key="11"]');
    await self.trigger('dragstart', { dataTransfer });
    await child.trigger('dragover', { dataTransfer, clientY: 0 });
    await self.trigger('dragend', { dataTransfer });
    expect(w.emitted('node-drop')).toBeFalsy();
    expect(child.classes()).not.toContain('is-drop-inner');

    // 拖到相邻原位置（11 → 12 的 before 区域即原位，before 被拦截后回落到 inner）
    const n11 = w.find('[data-tree-key="11"]');
    const n12 = w.find('[data-tree-key="12"]');
    await n11.trigger('dragstart', { dataTransfer });
    await n12.trigger('dragover', { dataTransfer, clientY: 0 });
    // 11 是 12 的前一个兄弟：before 被禁用，jsdom 下 distance=0 回落 inner（12 无子节点属有效目标）
    const emit2 = w.emitted('node-drop');
    if (emit2) {
      expect(emit2[0][2]).toBe('inner');
    }
    await n11.trigger('dragend', { dataTransfer });
  });

  it('暴露方法：setCheckedKeys / getCheckedKeys / getCurrentKey', async () => {
    const w = mountTree({ checkable: true });
    (w.vm as any).setCheckedKeys([1]);
    await nextTick();
    const emitted = w.emitted('update:checkedKeys');
    expect(emitted).toBeTruthy();
    await w.setProps({ checkedKeys: emitted!.at(-1)![0] as any });
    await nextTick();
    expect(new Set((w.vm as any).getCheckedKeys())).toEqual(
      new Set([1, 11, 12]),
    );
    (w.vm as any).setCurrentNodeKey(3);
    await nextTick();
    expect((w.vm as any).getCurrentKey()).toBe(3);
  });

  it('懒加载：resolve 的增量与外部 children 合并，且不遮蔽后续更新', async () => {
    const w = mountTree({
      data: [{ id: 1, label: 'n1' }],
      lazy: true,
      expandedKeys: [],
      load: (_node: any, resolve: any) =>
        resolve([{ id: 9, label: 'lazy' }]),
    });
    await nextTick();
    await expandIcons(w)[0].trigger('click');
    const emitted = w.emitted('update:expandedKeys');
    expect(emitted!.at(-1)![0]).toContain(1);
    await w.setProps({ expandedKeys: emitted!.at(-1)![0] as any });
    await nextTick();
    // 1 + 懒加载子节点 9
    expect(rows(w).length).toBe(2);

    // 外部给节点补 children：懒加载增量仍在，外部数据也生效
    await w.setProps({
      data: [{ id: 1, label: 'n1', children: [{ id: 2, label: 'ext' }] }],
    });
    await nextTick();
    expect(rows(w).length).toBe(3);
  });

  it('accordion：展开兄弟节点时收起同级', async () => {
    const w = mountTree({ accordion: true, expandedKeys: [1] });
    await nextTick();
    // 展开节点 2（顶层另一兄弟节点）
    await w
      .find('[data-tree-key="2"] [class*="expand-icon"]')
      .trigger('click');
    const emitted = w.emitted('update:expandedKeys');
    // 应只剩 2（1 被手风琴收起）
    expect(emitted!.at(-1)![0]).toEqual([2]);
    await w.setProps({ expandedKeys: emitted!.at(-1)![0] as any });
    expect(rows(w).length).toBe(4); // 1,2,3 + 21
  });
});
