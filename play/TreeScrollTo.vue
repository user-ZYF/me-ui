<!-- MeTree scrollTo 滚动定位示例 -->
<template>
  <div class="play-tree-scroll">
    <h1>MeTree 滚动定位（scrollTo）示例</h1>
    <p class="play-intro">
      通过 ref 调用 <code>scrollTo(options)</code> 将指定节点滚动到可视区域。
      options 支持 <code>key</code> / <code>align</code> / <code>offset</code> /
      <code>behavior</code> / <code>autoExpand</code> 五个参数，普通模式与虚拟滚动模式均可用。
    </p>

    <!-- ==================== 普通模式 ==================== -->
    <section class="play-section">
      <h2>普通模式</h2>
      <p class="play-desc">
        普通模式下，scrollTo 会通过内置滚动条组件滚动到目标节点。
        当目标节点被折叠隐藏时，<code>autoExpand</code> 会自动展开其所有祖先节点。
      </p>

      <!-- 控制面板 -->
      <div class="play-panel">
        <div class="play-panel-row">
          <span class="play-panel-label">目标 key</span>
          <a-input-number
            v-model:value="normalKey"
            :min="0"
            style="width: 120px"
          />
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">align</span>
          <a-radio-group v-model:value="normalAlign">
            <a-radio-button value="auto">auto</a-radio-button>
            <a-radio-button value="top">top</a-radio-button>
            <a-radio-button value="bottom">bottom</a-radio-button>
          </a-radio-group>
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">behavior</span>
          <a-radio-group v-model:value="normalBehavior">
            <a-radio-button value="auto">auto</a-radio-button>
            <a-radio-button value="smooth">smooth</a-radio-button>
          </a-radio-group>
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">offset (px)</span>
          <a-input-number
            v-model:value="normalOffset"
            :step="10"
            style="width: 120px"
          />
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">autoExpand</span>
          <a-switch v-model:checked="normalAutoExpand" />
          <span class="play-panel-hint">关闭后，目标节点若被折叠则滚动失败</span>
        </div>
        <div class="play-panel-row">
          <a-button type="primary" @click="handleNormalScroll">执行 scrollTo</a-button>
          <a-button @click="handleNormalReset">折叠所有节点</a-button>
        </div>
      </div>

      <!-- 树容器（固定高度 + 滚动） -->
      <div class="play-border">
        <me-tree
          ref="normalTreeRef"
          :data="scrollData"
          node-key="id"
          v-model:expanded-keys="normalExpandedKeys"
          :max-height="240"
        />
      </div>
      <div class="play-v-model">expandedKeys: {{ normalExpandedKeys }}</div>
      <div v-if="normalLog" class="play-log">{{ normalLog }}</div>
    </section>

    <!-- ==================== 虚拟滚动模式 ==================== -->
    <section class="play-section">
      <h2>虚拟滚动模式</h2>
      <p class="play-desc">
        虚拟滚动模式下，scrollTo 会将目标节点滚动到列表可视区的指定位置，
        <code>offset</code> 可在 align 基础上叠加额外偏移。
      </p>

      <!-- 控制面板 -->
      <div class="play-panel">
        <div class="play-panel-row">
          <span class="play-panel-label">目标 key</span>
          <a-input
            v-model:value="virtualKey"
            placeholder="如 50-2-1"
            style="width: 160px"
          />
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">align</span>
          <a-radio-group v-model:value="virtualAlign">
            <a-radio-button value="auto">auto</a-radio-button>
            <a-radio-button value="top">top</a-radio-button>
            <a-radio-button value="bottom">bottom</a-radio-button>
          </a-radio-group>
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">behavior</span>
          <a-radio-group v-model:value="virtualBehavior">
            <a-radio-button value="auto">auto</a-radio-button>
            <a-radio-button value="smooth">smooth</a-radio-button>
          </a-radio-group>
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">offset (px)</span>
          <a-input-number
            v-model:value="virtualOffset"
            :step="10"
            style="width: 120px"
          />
        </div>
        <div class="play-panel-row">
          <span class="play-panel-label">autoExpand</span>
          <a-switch v-model:checked="virtualAutoExpand" />
        </div>
        <div class="play-panel-row">
          <a-button type="primary" @click="handleVirtualScroll">执行 scrollTo</a-button>
          <a-button @click="handleVirtualRandom">随机生成目标 key</a-button>
        </div>
      </div>

      <!-- 虚拟滚动树 -->
      <div class="play-border">
        <me-tree
          ref="virtualTreeRef"
          :data="virtualData"
          node-key="id"
          virtual
          :height="240"
          :item-height="26"
        />
      </div>
      <div v-if="virtualLog" class="play-log">{{ virtualLog }}</div>
    </section>

    <!-- ==================== 参数说明 ==================== -->
    <section class="play-section">
      <h2>TreeScrollToOptions 参数说明</h2>
      <table class="play-table">
        <thead>
          <tr>
            <th>参数</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>key</code></td>
            <td><code>string | number</code></td>
            <td>—</td>
            <td>必填，目标节点 key（对应 node-key 字段值）</td>
          </tr>
          <tr>
            <td><code>align</code></td>
            <td><code>'top' | 'bottom' | 'auto'</code></td>
            <td><code>'auto'</code></td>
            <td>对齐方式：顶部 / 底部 / 自动（仅滚动到可见）</td>
          </tr>
          <tr>
            <td><code>offset</code></td>
            <td><code>number</code></td>
            <td><code>0</code></td>
            <td>额外偏移量（px），正数向下偏移，负数向上偏移</td>
          </tr>
          <tr>
            <td><code>behavior</code></td>
            <td><code>'auto' | 'smooth'</code></td>
            <td><code>'auto'</code></td>
            <td>滚动行为：瞬时 / 平滑</td>
          </tr>
          <tr>
            <td><code>autoExpand</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>是否自动展开目标节点的所有祖先节点</td>
          </tr>
        </tbody>
      </table>
      <p class="play-desc">
        返回值：<code>boolean</code>。<code>true</code> 表示节点存在且可定位；
        <code>false</code> 表示未找到节点，或 <code>autoExpand=false</code> 时节点被折叠隐藏。
      </p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

// ==================== 普通模式 ====================

/** 普通树引用 */
const normalTreeRef = ref();
/** 普通树目标 key */
const normalKey = ref<number>(865);
/** 普通树 align */
const normalAlign = ref<'top' | 'bottom' | 'auto'>('top');
/** 普通树 behavior */
const normalBehavior = ref<'auto' | 'smooth'>('smooth');
/** 普通树 offset */
const normalOffset = ref<number>(0);
/** 普通树 autoExpand */
const normalAutoExpand = ref<boolean>(true);
/** 普通树展开 keys */
const normalExpandedKeys = ref<any[]>([]);
/** 普通树日志 */
const normalLog = ref('');

/** 普通树数据（含多层嵌套，用于演示折叠后定位） */
function generateScrollData(rootCount = 8, childCount = 6, leafCount = 5) {
  const data: any[] = [];
  for (let i = 1; i <= rootCount; i++) {
    const children: any[] = [];
    for (let j = 1; j <= childCount; j++) {
      const leaves: any[] = [];
      for (let k = 1; k <= leafCount; k++) {
        leaves.push({
          id: i * 100 + j * 10 + k,
          label: `三级节点 ${i}-${j}-${k}`,
        });
      }
      children.push({
        id: i * 100 + j,
        label: `二级节点 ${i}-${j}`,
        children: leaves,
      });
    }
    data.push({
      id: i,
      label: `一级节点 ${i}`,
      children,
    });
  }
  return data;
}

const scrollData = generateScrollData();

/** 普通树执行 scrollTo */
function handleNormalScroll() {
  const success = normalTreeRef.value?.scrollTo({
    key: normalKey.value,
    align: normalAlign.value,
    offset: normalOffset.value,
    behavior: normalBehavior.value,
    autoExpand: normalAutoExpand.value,
  });
  normalLog.value = `scrollTo({ key: ${normalKey.value}, align: '${normalAlign.value}', offset: ${normalOffset.value}, behavior: '${normalBehavior.value}', autoExpand: ${normalAutoExpand.value} }) → ${success ? '成功' : '失败'}`;
  if (!success) {
    message.warning('滚动失败：节点不存在或被折叠隐藏');
  }
}

/** 折叠所有节点 */
function handleNormalReset() {
  normalExpandedKeys.value = [];
  normalLog.value = '已折叠所有节点';
}

// ==================== 虚拟滚动模式 ====================

/** 虚拟树引用 */
const virtualTreeRef = ref();
/** 虚拟树目标 key */
const virtualKey = ref<string>('50-2-1');
/** 虚拟树 align */
const virtualAlign = ref<'top' | 'bottom' | 'auto'>('top');
/** 虚拟树 behavior */
const virtualBehavior = ref<'auto' | 'smooth'>('smooth');
/** 虚拟树 offset */
const virtualOffset = ref<number>(0);
/** 虚拟树 autoExpand */
const virtualAutoExpand = ref<boolean>(true);
/** 虚拟树日志 */
const virtualLog = ref('');

/** 生成虚拟滚动大数据 */
function generateVirtualData(count: number) {
  const data: any[] = [];
  for (let i = 0; i < count; i++) {
    const children: any[] = [];
    for (let j = 0; j < 5; j++) {
      const grandChildren: any[] = [];
      for (let k = 0; k < 3; k++) {
        grandChildren.push({
          id: `${i}-${j}-${k}`,
          label: `节点 ${i}-${j}-${k}`,
        });
      }
      children.push({
        id: `${i}-${j}`,
        label: `节点 ${i}-${j}`,
        children: grandChildren,
      });
    }
    data.push({
      id: `${i}`,
      label: `根节点 ${i}`,
      children,
    });
  }
  return data;
}

/** 虚拟滚动数据（100 个根节点） */
const virtualData = generateVirtualData(100);

/** 虚拟树执行 scrollTo */
function handleVirtualScroll() {
  const success = virtualTreeRef.value?.scrollTo({
    key: virtualKey.value,
    align: virtualAlign.value,
    offset: virtualOffset.value,
    behavior: virtualBehavior.value,
    autoExpand: virtualAutoExpand.value,
  });
  virtualLog.value = `scrollTo({ key: '${virtualKey.value}', align: '${virtualAlign.value}', offset: ${virtualOffset.value}, behavior: '${virtualBehavior.value}', autoExpand: ${virtualAutoExpand.value} }) → ${success ? '成功' : '失败'}`;
  if (!success) {
    message.warning('滚动失败：节点不存在');
  }
}

/** 随机生成虚拟树目标 key */
function handleVirtualRandom() {
  const i = Math.floor(Math.random() * 100);
  const j = Math.floor(Math.random() * 5);
  const k = Math.floor(Math.random() * 3);
  virtualKey.value = `${i}-${j}-${k}`;
}
</script>

<style lang="less">
.play-tree-scroll {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .play-intro {
    font-size: 14px;
    color: #666;
    line-height: 1.8;
    margin-bottom: 32px;

    code {
      padding: 1px 6px;
      background: #f5f5f5;
      border-radius: 3px;
      font-size: 13px;
      color: #c41d7f;
    }
  }

  .play-section {
    margin-bottom: 40px;

    h2 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .play-desc {
      font-size: 13px;
      color: #999;
      margin-bottom: 12px;
      line-height: 1.7;

      code {
        padding: 1px 5px;
        background: #f5f5f5;
        border-radius: 3px;
        font-size: 12px;
        color: #c41d7f;
      }
    }
  }

  .play-panel {
    margin-bottom: 16px;
    padding: 16px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 6px;

    .play-panel-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .play-panel-label {
        width: 90px;
        flex-shrink: 0;
        font-size: 13px;
        color: #666;
      }

      .play-panel-hint {
        margin-left: 12px;
        font-size: 12px;
        color: #bbb;
      }

      .ant-btn {
        margin-right: 8px;
      }
    }
  }

  .play-border {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 12px;
    min-height: 60px;
  }

  .play-v-model {
    margin-top: 8px;
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
    color: #666;
    word-break: break-all;
  }

  .play-log {
    margin-top: 8px;
    padding: 8px 12px;
    background: #f0f5ff;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
    color: #1677ff;
    word-break: break-all;
  }

  .play-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th,
    td {
      padding: 8px 12px;
      border: 1px solid #e8e8e8;
      text-align: left;
    }

    th {
      background: #fafafa;
      font-weight: 600;
    }

    td {
      code {
        padding: 1px 5px;
        background: #f5f5f5;
        border-radius: 3px;
        font-size: 12px;
        color: #c41d7f;
      }
    }
  }
}
</style>
