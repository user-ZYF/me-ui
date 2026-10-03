<!-- data 响应式深度追踪示例：对比响应式数据与普通对象的原地修改效果 -->
<template>
  <div class="play-tree">
    <h1>data 深度响应式对比</h1>

    <section class="play-section">
      <h2>响应式 data（ref 包装）</h2>
      <p class="play-desc">
        data 来自 ref，原地修改深层字段（追加子节点、改 label）会自动触发实体图重建
      </p>
      <div class="play-actions">
        <button @click="pushChildReactive">
          原地 push 子节点（data[0].children.push）
        </button>
        <button @click="renameReactive">原地改 data[0].label</button>
      </div>
      <div class="play-border">
        <me-tree
          :data="reactiveData"
          node-key="id"
          v-model:expanded-keys="expandedKeys"
        />
      </div>
    </section>

    <section class="play-section">
      <h2>非响应式 data（普通对象）</h2>
      <p class="play-desc">
        data 是普通字面量，原地修改 Vue 感知不到，树不会更新；必须整体替换引用才生效
      </p>
      <div class="play-actions">
        <button @click="pushChildPlain">
          原地 push 子节点（无效果）
        </button>
        <button @click="replacePlain">整体替换 plainData = [...]</button>
      </div>
      <div class="play-border">
        <me-tree
          :data="plainData"
          node-key="id"
          v-model:expanded-keys="expandedKeys"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

let idSeq = 100;

function makeData() {
  return [
    {
      id: 1,
      label: "节点 1",
      children: [
        { id: 11, label: "节点 1-1" },
        { id: 12, label: "节点 1-2" },
      ],
    },
    { id: 2, label: "节点 2" },
  ];
}

/** 响应式：ref 包装的数组，深层变更可被追踪 */
const reactiveData = ref<any[]>(makeData());

/** 非响应式：普通字面量，深层变更 Vue 感知不到 */
let rawPlain: any[] = makeData();
const plainData = ref<any[]>(rawPlain);

const expandedKeys = ref<number[]>([1]);

function pushChildReactive() {
  reactiveData.value[0].children.push({
    id: idSeq++,
    label: `新增节点 ${idSeq}`,
  });
}

function renameReactive() {
  reactiveData.value[0].label = `节点 1（已修改 ${idSeq++}）`;
}

function pushChildPlain() {
  rawPlain[0].children.push({ id: idSeq++, label: `新增节点 ${idSeq}` });
  // plainData.value 引用没变，视图不更新
}

function replacePlain() {
  plainData.value = [...rawPlain];
}
</script>

<style scoped>
.play-tree {
  padding: 20px;
}
.play-section {
  margin-bottom: 24px;
}
.play-desc {
  color: #666;
  font-size: 13px;
}
.play-border {
  border: 1px solid #ddd;
  padding: 12px;
  width: 320px;
}
.play-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
