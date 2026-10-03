<!-- MeTree 树组件完整功能示例 -->
<template>
  <div class="play-tree">
    <h1>MeTree 树组件示例</h1>

    <!-- ==================== 基础功能 ==================== -->

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">最基础的树形结构展示</p>
      <div class="play-border">
        <me-tree :data="baseData" node-key="id" />
      </div>
    </section>
    
    <!-- 默认展开指定节点 -->
    <section class="play-section">
      <h2>默认展开指定节点</h2>
      <p class="play-desc">通过 v-model:expanded-keys 指定展开的节点，需配合 node-key</p>
      <div class="play-border">
        <me-tree
          :data="baseData"
          node-key="id"
          v-model:expanded-keys="specificExpandedKeys"
        />
      </div>
      <div class="play-v-model">expandedKeys: {{ specificExpandedKeys }}</div>
    </section>

    <!-- 手风琴模式 -->
    <section class="play-section">
      <h2>手风琴模式</h2>
      <p class="play-desc">同一级节点每次只能展开一个</p>
      <div class="play-border">
        <me-tree :data="baseData" node-key="id" accordion />
      </div>
    </section>

    <!-- 自定义缩进 -->
    <section class="play-section">
      <h2>自定义缩进</h2>
      <p class="play-desc">通过 indent 控制层级缩进距离（默认 18px，此处 32px）</p>
      <div class="play-border">
        <me-tree
          :data="baseData"
          node-key="id"
          :indent="32"
        />
      </div>
    </section>

    <!-- ==================== 复选框功能 ==================== -->

    <!-- 显示复选框 -->
    <section class="play-section">
      <h2>显示复选框</h2>
      <p class="play-desc">设置 checkable 显示复选框，父子节点联动选中</p>
      <div class="play-border">
        <me-tree :data="baseData" node-key="id" checkable />
      </div>
    </section>

    <!-- 复选框 + 严格模式 -->
    <section class="play-section">
      <h2>复选框 + 严格模式</h2>
      <p class="play-desc">设置 check-strictly，父节点与子节点选中状态互不关联</p>
      <div class="play-border">
        <me-tree :data="baseData" node-key="id" checkable check-strictly />
      </div>
    </section>

    <!-- 复选框 + 默认选中 -->
    <section class="play-section">
      <h2>复选框 + 默认选中</h2>
      <p class="play-desc">通过 v-model:checked-keys 指定默认选中的节点</p>
      <div class="play-border">
        <me-tree
          :data="baseData"
          node-key="id"
          checkable
          v-model:checked-keys="defaultCheckedKeys"
        />
      </div>
      <div class="play-v-model">checkedKeys: {{ defaultCheckedKeys }}</div>
    </section>

    <!-- 复选框 + 手风琴 -->
    <section class="play-section">
      <h2>复选框 + 手风琴</h2>
      <p class="play-desc">手风琴模式与复选框组合使用</p>
      <div class="play-border">
        <me-tree :data="baseData" node-key="id" checkable accordion />
      </div>
    </section>

    <!-- ==================== 自定义 ==================== -->

    <!-- 自定义节点内容 -->
    <section class="play-section">
      <h2>自定义节点内容</h2>
      <p class="play-desc">通过默认插槽自定义节点渲染，此处展示带操作按钮的节点</p>
      <div class="play-border">
        <me-tree :data="baseData" node-key="id">
          <template #default="{ node }">
            <span class="play-tree-custom-node">
              <span class="play-tree-custom-label">{{ node.label }}</span>
              <a
                class="play-tree-custom-action"
                @click.stop="message.info(`点击了：${node.label}`)"
              >操作</a>
            </span>
          </template>
        </me-tree>
      </div>
    </section>

    <!-- 自定义节点内容（高度不固定） -->
    <section class="play-section">
      <h2>自定义节点内容（高度不固定）</h2>
      <p class="play-desc">通过默认插槽自定义节点渲染，每个节点内容高度不一致，组件按实际内容自适应高度</p>
      <div class="play-border">
        <me-tree
          :data="variableHeightData"
          node-key="id"
          v-model:expanded-keys="variableHeightExpandedKeys"
        >
          <template #default="{ node, data }">
            <div class="play-tree-card">
              <div class="play-tree-card-header">
                <span class="play-tree-card-title">{{ node.label }}</span>
                <a-tag :color="data.status === 'online' ? 'green' : data.status === 'busy' ? 'orange' : 'default'">
                  {{ data.status === 'online' ? '在线' : data.status === 'busy' ? '忙碌' : '离线' }}
                </a-tag>
              </div>
              <div v-if="data.desc" class="play-tree-card-desc">{{ data.desc }}</div>
              <div v-if="data.tags && data.tags.length" class="play-tree-card-tags">
                <a-tag v-for="tag in data.tags" :key="tag" color="blue">{{ tag }}</a-tag>
              </div>
              <div v-if="data.meta" class="play-tree-card-meta">
                <span>ID: {{ data.id }}</span>
                <span>负责人: {{ data.owner }}</span>
                <span>更新时间: {{ data.updatedAt }}</span>
              </div>
            </div>
          </template>
        </me-tree>
      </div>
    </section>

    <!-- 自定义 props 映射 -->
    <section class="play-section">
      <h2>自定义字段映射</h2>
      <p class="play-desc">通过 fieldMap 自定义字段名，此处使用 name 作为 label、subList 作为 children</p>
      <div class="play-border">
        <me-tree
          :data="customPropsData"
          node-key="id"
          :field-map="customProps"
        />
      </div>
    </section>

    <!-- ==================== 懒加载 ==================== -->

    <!-- 懒加载 -->
    <section class="play-section">
      <h2>懒加载</h2>
      <p class="play-desc">设置 lazy 开启懒加载，通过 load 函数动态加载子节点</p>
      <div class="play-border">
        <me-tree :data="lazyData" node-key="id" lazy :load="loadNode" />
      </div>
    </section>

    <!-- 懒加载 + 复选框 -->
    <section class="play-section">
      <h2>懒加载 + 复选框</h2>
      <p class="play-desc">懒加载与复选框组合使用</p>
      <div class="play-border">
        <me-tree :data="lazyData" node-key="id" lazy :load="loadNode" checkable />
      </div>
    </section>

    <!-- ==================== 拖拽 ==================== -->

    <!-- 拖拽排序 -->
    <section class="play-section">
      <h2>拖拽排序</h2>
      <p class="play-desc">设置 draggable 开启节点拖拽排序</p>
      <div class="play-border">
        <me-tree
          :data="dragData"
          node-key="id"
          draggable
          @node-drop="(n: any, d: any, t: any) => onNodeDrop(dragData, n, d, t)"
        />
      </div>
    </section>

    <!-- 拖拽 + 复选框 -->
    <section class="play-section">
      <h2>拖拽 + 复选框</h2>
      <p class="play-desc">拖拽与复选框组合使用</p>
      <div class="play-border">
        <me-tree
          :data="dragData"
          node-key="id"
          draggable
          checkable
          @node-drop="(n: any, d: any, t: any) => onNodeDrop(dragData, n, d, t)"
        />
      </div>
    </section>

    <!-- 拖拽 + allowDrag 控制可拖拽节点 -->
    <section class="play-section">
      <h2>拖拽 + allowDrag 控制可拖拽节点</h2>
      <p class="play-desc">通过 allow-drag 函数返回 false 的节点不可拖起（draggable 字段控制）。未设置 allow-drop 时所有放置位置均允许，故每个节点都标注「可放入 + 可前后」</p>
      <div class="play-border">
        <me-tree
          :data="allowDragData"
          node-key="id"
          draggable
          :allow-drag="checkDraggable"
          @node-drop="(n: any, d: any, t: any) => onNodeDrop(allowDragData, n, d, t)"
        >
          <template #default="{ data }">
            <span class="play-tree-drag-node">
              <span class="play-tree-drag-label">{{ data.label }}</span>
              <span class="play-tree-drag-tags">
                <a-tag :color="data.draggable === false ? 'red' : 'green'">
                  {{ data.draggable === false ? '禁拖' : '可拖' }}
                </a-tag>
                <a-tag color="blue">可放入</a-tag>
                <a-tag color="cyan">可前后</a-tag>
              </span>
            </span>
          </template>
        </me-tree>
      </div>
    </section>

    <!-- 拖拽 + allowDrop 控制放置位置 -->
    <section class="play-section">
      <h2>拖拽 + allowDrop 控制放置位置</h2>
      <p class="play-desc">通过 allow-drop 控制节点可接受的放置类型：inner（放入内部）/ before（前方）/ after（后方），由 allowInner/allowSibling 字段控制。未设置 allow-drag 时所有节点均可拖起</p>
      <div class="play-border">
        <me-tree
          :data="allowDropData"
          node-key="id"
          draggable
          :allow-drop="checkDroppable"
          @node-drop="(n: any, d: any, t: any) => onNodeDrop(allowDropData, n, d, t)"
        >
          <template #default="{ data }">
            <span class="play-tree-drag-node">
              <span class="play-tree-drag-label">{{ data.label }}</span>
              <span class="play-tree-drag-tags">
                <a-tag color="green">可拖</a-tag>
                <a-tag v-if="data.allowInner" color="blue">可放入</a-tag>
                <a-tag v-if="data.allowSibling" color="cyan">可前后</a-tag>
                <a-tag v-if="!data.allowInner && !data.allowSibling" color="red">禁放</a-tag>
              </span>
            </span>
          </template>
        </me-tree>
      </div>
    </section>

    <!-- 拖拽 + 综合规则 -->
    <section class="play-section">
      <h2>拖拽 + 综合规则（disabled / draggable / dropType）</h2>
      <p class="play-desc">综合规则：disabled 节点不可拖拽也不可作为放置目标；容器节点仅允许放入内部；叶子节点仅允许前后插入。每个节点同时标注「拖拽能力」与「放置能力」</p>
      <div class="play-border">
        <me-tree
          :data="comprehensiveDragData"
          node-key="id"
          draggable
          :allow-drag="checkComprehensiveDrag"
          :allow-drop="checkComprehensiveDrop"
          @node-drop="(n: any, d: any, t: any) => onNodeDrop(comprehensiveDragData, n, d, t)"
        >
          <template #default="{ node, data }">
            <span class="play-tree-drag-node">
              <span class="play-tree-drag-label">{{ data.label }}</span>
              <span class="play-tree-drag-tags">
                <!-- 拖拽能力 -->
                <a-tag :color="data.disabled ? 'red' : 'green'">
                  {{ data.disabled ? '禁拖' : '可拖' }}
                </a-tag>
                <!-- 放置能力 -->
                <a-tag v-if="data.disabled" color="red">禁放</a-tag>
                <a-tag v-else-if="node.isLeaf" color="cyan">可前后</a-tag>
                <a-tag v-else color="blue">可放入</a-tag>
              </span>
            </span>
          </template>
        </me-tree>
      </div>
    </section>

    <!-- ==================== 虚拟滚动 ==================== -->

    <!-- 虚拟滚动 -->
    <section class="play-section">
      <h2>虚拟滚动</h2>
      <p class="play-desc">设置 virtual 开启虚拟滚动，适用于大数据量场景（此处 100 个根节点，每个含子节点）</p>
      <div class="play-border">
        <me-tree :data="virtualData" node-key="id" virtual :height="300" :item-height="26" />
      </div>
    </section>

    <!-- 虚拟滚动 + 复选框 -->
    <section class="play-section">
      <h2>虚拟滚动 + 复选框</h2>
      <p class="play-desc">虚拟滚动与复选框组合使用</p>
      <div class="play-border">
        <me-tree :data="virtualData" node-key="id" virtual checkable :height="300" :item-height="26" />
      </div>
    </section>

    <!-- 虚拟滚动 + 手风琴 -->
    <section class="play-section">
      <h2>虚拟滚动 + 手风琴</h2>
      <p class="play-desc">虚拟滚动与手风琴模式组合使用</p>
      <div class="play-border">
        <me-tree :data="virtualData" node-key="id" virtual accordion :height="300" :item-height="26" />
      </div>
    </section>

    <!-- 虚拟滚动 + 拖拽 -->
    <section class="play-section">
      <h2>虚拟滚动 + 拖拽</h2>
      <p class="play-desc">虚拟滚动与拖拽排序组合使用，适用于大数据量场景下的拖拽排序</p>
      <div class="play-border">
        <me-tree
          :data="virtualDragData"
          node-key="id"
          virtual
          draggable
          :height="300"
          :item-height="26"
          @node-drop="(n: any, d: any, t: any) => onNodeDrop(virtualDragData, n, d, t)"
        />
      </div>
    </section>

    <!-- 虚拟滚动 + 拖拽 + 复选框 -->
    <section class="play-section">
      <h2>虚拟滚动 + 拖拽 + 复选框</h2>
      <p class="play-desc">虚拟滚动、拖拽排序与复选框三者组合使用，适用于大数据量场景下的可拖拽可选中需求</p>
      <div class="play-border">
        <me-tree
          :data="virtualDragCheckData"
          node-key="id"
          virtual
          draggable
          checkable
          :height="300"
          :item-height="26"
          @node-drop="(n: any, d: any, t: any) => onNodeDrop(virtualDragCheckData, n, d, t)"
          @check="onVirtualDragCheck"
        />
      </div>
      <div class="play-v-model">checkedKeys: {{ virtualDragCheckedKeys }}</div>
    </section>

    <!-- 虚拟滚动 + 懒加载 -->
    <section class="play-section">
      <h2>虚拟滚动 + 懒加载</h2>
      <p class="play-desc">虚拟滚动与懒加载组合使用，展开节点时动态加载子节点并扁平化渲染</p>
      <div class="play-border">
        <me-tree :data="virtualLazyData" node-key="id" virtual lazy :load="loadNode" :height="300" :item-height="26" />
      </div>
    </section>

    <!-- ==================== 方法调用 ==================== -->

    <!-- 方法调用演示 -->
    <section class="play-section">
      <h2>方法调用演示</h2>
      <p class="play-desc">受控模式下通过 v-model 操作状态，scrollTo 滚动定位，getNode / getHalfCheckedKeys 读取内部信息</p>
      <div class="play-method-row">
        <a-button @click="handleScrollTo">滚动到节点(id=121, autoExpand)</a-button>
        <a-button @click="handleScrollToVirtual">虚拟树滚动到节点</a-button>
        <a-button @click="handleGetHalfChecked">获取半选 keys</a-button>
        <a-button @click="handleGetNode">获取节点(id=1)</a-button>
        <a-button @click="handleSetCheckedVModel">通过 v-model 设置选中</a-button>
        <a-button @click="handleSetExpandedVModel">通过 v-model 设置展开</a-button>
        <a-button @click="handleSetCurrentVModel">通过 v-model 设置当前</a-button>
        <a-button @click="handleAppendData">直接改 data 追加子节点</a-button>
        <a-button @click="handleRemoveData">直接改 data 移除节点</a-button>
      </div>
      <div class="play-border">
        <me-tree
          ref="methodTreeRef"
          :data="methodData"
          node-key="id"
          checkable
          v-model:expanded-keys="methodExpandedKeys"
          v-model:checked-keys="methodCheckedKeys"
          v-model:current-node-key="methodCurrentNodeKey"
          @node-click="onMethodNodeClick"
        />
      </div>
      <div class="play-v-model">expandedKeys: {{ methodExpandedKeys }} | checkedKeys: {{ methodCheckedKeys }} | currentNodeKey: {{ methodCurrentNodeKey }}</div>
      <div v-if="methodLog" class="play-log">{{ methodLog }}</div>
      <p class="play-desc" style="margin-top: 12px;">虚拟滚动 scrollTo 演示</p>
      <div class="play-border">
        <me-tree
          ref="methodVirtualTreeRef"
          :data="virtualData"
          node-key="id"
          virtual
          :height="200"
          :item-height="26"
        />
      </div>
    </section>

    <!-- ==================== 事件监听 ==================== -->

    <!-- 事件监听演示 -->
    <section class="play-section">
      <h2>事件监听演示</h2>
      <p class="play-desc">监听所有可用事件，事件信息实时显示在下方日志区域</p>
      <div class="play-border">
        <me-tree
          :data="baseData"
          node-key="id"
          checkable
          draggable
          @node-click="onEventLog('node-click', $event)"
          @node-expand="onEventLog('node-expand', $event)"
          @node-collapse="onEventLog('node-collapse', $event)"
          @current-change="onEventLog('current-change', $event)"
          @check-change="onEventLog('check-change', $event)"
          @check="onEventLog('check', $event)"
          @node-contextmenu="onEventLog('node-contextmenu', $event)"
          @node-drag-start="onEventLog('node-drag-start', $event)"
          @node-drag-end="onEventLog('node-drag-end', $event)"
          @node-drop="onEventLog('node-drop', $event)"
          @node-drag-enter="onEventLog('node-drag-enter', $event)"
          @node-drag-over="onEventLog('node-drag-over', $event)"
          @node-drag-leave="onEventLog('node-drag-leave', $event)"
        />
      </div>
      <div class="play-event-log">
        <div v-for="(log, index) in eventLogs" :key="index" class="play-event-log-item">
          {{ log }}
        </div>
      </div>
    </section>

    <!-- ==================== 右键菜单 ==================== -->

    <!-- 右键菜单 -->
    <section class="play-section">
      <h2>右键菜单</h2>
      <p class="play-desc">通过 node-contextmenu 事件实现右键菜单，右键点击节点试试</p>
      <div class="play-border">
        <me-tree
          :data="baseData"
          node-key="id"
          @node-contextmenu="onContextmenu"
        />
      </div>
    </section>

    <!-- ==================== 组合场景 ==================== -->

    <!-- 组合：复选框 + 严格模式 + 手风琴 + 高亮 -->
    <section class="play-section">
      <h2>组合：复选框 + 严格模式 + 手风琴 + 高亮当前</h2>
      <p class="play-desc">多种功能组合使用，适用于复杂业务场景</p>
      <div class="play-border">
        <me-tree
          :data="baseData"
          node-key="id"
          checkable
          check-strictly
          accordion
          v-model:current-node-key="comboCurrentNodeKey"
        />
      </div>
    </section>

    <!-- 组合：懒加载 + 复选框 + 高亮当前 -->
    <section class="play-section">
      <h2>组合：懒加载 + 复选框 + 高亮当前</h2>
      <p class="play-desc">懒加载与复选框、高亮当前节点组合使用</p>
      <div class="play-border">
        <me-tree
          :data="lazyData"
          node-key="id"
          lazy
          :load="loadNode"
          checkable
        />
      </div>
    </section>

    <!-- 组合：虚拟滚动 + 复选框 + 严格模式 -->
    <section class="play-section">
      <h2>组合：虚拟滚动 + 复选框 + 严格模式</h2>
      <p class="play-desc">大数据量场景下的复选框严格模式</p>
      <div class="play-border">
        <me-tree
          :data="virtualData"
          node-key="id"
          virtual
          checkable
          check-strictly
          :height="300"
          :item-height="26"
        />
      </div>
    </section>

    <!-- 组合：自定义渲染 + 懒加载 + 手风琴 -->
    <section class="play-section">
      <h2>组合：自定义渲染 + 懒加载 + 手风琴</h2>
      <p class="play-desc">自定义节点内容与懒加载、手风琴模式组合使用</p>
      <div class="play-border">
        <me-tree
          :data="lazyData"
          node-key="id"
          lazy
          :load="loadNode"
          accordion
        >
          <template #default="{ node }">
            <span class="play-tree-custom-node">
              <span class="play-tree-custom-label">{{ node.label }}</span>
              <a
                class="play-tree-custom-action"
                @click.stop="message.info(`点击了：${node.label}`)"
              >操作</a>
            </span>
          </template>
        </me-tree>
      </div>
    </section>

    <!-- 组合：虚拟滚动 + 复选框 + 手风琴 + 高亮当前 -->
    <section class="play-section">
      <h2>组合：虚拟滚动 + 复选框 + 手风琴 + 高亮当前</h2>
      <p class="play-desc">大数据量场景下的多功能组合</p>
      <div class="play-border">
        <me-tree
          :data="virtualData"
          node-key="id"
          virtual
          checkable
          accordion
          :height="300"
          :item-height="26"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

// ==================== v-model 绑定数据 ====================

/** 展开指定节点 keys */
const specificExpandedKeys = ref<any[]>([1, 11]);
/** 默认选中 keys */
const defaultCheckedKeys = ref<any[]>([111, 122]);
/** 组合场景当前节点 key */
const comboCurrentNodeKey = ref<any>(2);

// ==================== 基础数据 ====================

/** 基础树数据 */
const baseData = [
  {
    id: 1,
    label: '一级节点 1',
    children: [
      {
        id: 11,
        label: '二级节点 1-1',
        children: [
          { id: 111, label: '三级节点 1-1-1' },
          { id: 112, label: '三级节点 1-1-2' },
        ],
      },
      {
        id: 12,
        label: '二级节点 1-2',
        children: [
          { id: 121, label: '三级节点 1-2-1' },
          { id: 122, label: '三级节点 1-2-2' },
        ],
      },
    ],
  },
  {
    id: 2,
    label: '一级节点 2',
    children: [
      { id: 21, label: '二级节点 2-1' },
      {
        id: 22,
        label: '二级节点 2-2（禁用）',
        disabled: true,
        children: [
          { id: 221, label: '三级节点 2-2-1' },
          { id: 222, label: '三级节点 2-2-2' },
        ],
      },
    ],
  },
  {
    id: 3,
    label: '一级节点 3',
    children: [
      { id: 31, label: '二级节点 3-1' },
    ],
  },
];

/** 自定义 props 映射数据 */
const customPropsData = [
  {
    id: 1,
    name: '自定义节点 1',
    subList: [
      {
        id: 11,
        name: '自定义子节点 1-1',
        subList: [
          { id: 111, name: '自定义孙节点 1-1-1' },
        ],
      },
      {
        id: 12,
        name: '自定义子节点 1-2',
      },
    ],
  },
  {
    id: 2,
    name: '自定义节点 2',
    subList: [
      { id: 21, name: '自定义子节点 2-1' },
    ],
  },
];

/** 自定义 props 配置 */
const customProps = {
  children: 'subList',
  label: 'name',
  disabled: 'disabled',
};

/** 自定义节点内容（高度不固定）数据 */
const variableHeightData = [
  {
    id: 1,
    label: '项目 Alpha',
    status: 'online',
    desc: '这是一个内容较长的节点，包含详细描述信息，用于演示节点高度不固定的场景。每个节点根据自身内容自适应高度，互不影响。',
    tags: ['前端', 'Vue', '组件库'],
    owner: '张三',
    updatedAt: '2026-09-12',
    children: [
      {
        id: 11,
        label: '模块 - 用户中心',
        status: 'online',
        desc: '负责用户登录、注册、权限管理等核心功能。',
        tags: ['Auth', 'RBAC'],
        owner: '李四',
        updatedAt: '2026-09-10',
        children: [
          {
            id: 111,
            label: '登录页',
            status: 'busy',
            owner: '王五',
            updatedAt: '2026-09-11',
          },
          {
            id: 112,
            label: '注册页',
            status: 'online',
            desc: '支持手机号、邮箱、第三方多种注册方式，含表单校验与图形验证码。',
            tags: ['表单', '校验'],
            owner: '赵六',
            updatedAt: '2026-09-09',
          },
        ],
      },
      {
        id: 12,
        label: '模块 - 商品管理',
        status: 'offline',
        desc: '商品的增删改查、分类管理、库存预警、上下架批量操作等功能模块。该节点内容较多，高度明显高于其他节点，用于演示高度不一致的效果。',
        tags: ['商品', '库存', '分类', '批量操作'],
        meta: true,
        owner: '孙七',
        updatedAt: '2026-09-08',
      },
    ],
  },
  {
    id: 2,
    label: '项目 Beta',
    status: 'busy',
    desc: '短描述节点。',
    owner: '周八',
    updatedAt: '2026-09-13',
    children: [
      {
        id: 21,
        label: '模块 - 订单',
        status: 'online',
        tags: ['订单', '支付'],
        owner: '吴九',
        updatedAt: '2026-09-12',
      },
    ],
  },
  {
    id: 3,
    label: '项目 Gamma',
    status: 'offline',
    owner: '郑十',
    updatedAt: '2026-09-01',
  },
];

/** 自定义节点内容（高度不固定）默认展开 keys */
const variableHeightExpandedKeys = ref<any[]>([1, 11, 2]);

/** 懒加载初始数据 */
const lazyData = [
  { id: 1, label: '懒加载节点 1', isLeaf: false },
  { id: 2, label: '懒加载节点 2', isLeaf: false },
  { id: 3, label: '懒加载叶子节点 3', isLeaf: true },
];

/** 拖拽数据 */
const dragData = ref([
  {
    id: 1,
    label: '可拖拽节点 1',
    children: [
      { id: 11, label: '子节点 1-1' },
      { id: 12, label: '子节点 1-2' },
    ],
  },
  {
    id: 2,
    label: '可拖拽节点 2',
    children: [
      { id: 21, label: '子节点 2-1' },
      { id: 22, label: '子节点 2-2' },
    ],
  },
  {
    id: 3,
    label: '可拖拽节点 3',
    children: [
      { id: 31, label: '子节点 3-1' },
    ],
  },
]);

/** allowDrag 演示数据 - draggable 字段控制可拖拽 */
const allowDragData = ref([
  {
    id: 1,
    label: '节点 1（可拖拽）',
    draggable: true,
    children: [
      { id: 11, label: '节点 1-1（禁拖）', draggable: false },
      { id: 12, label: '节点 1-2（可拖拽）', draggable: true },
    ],
  },
  {
    id: 2,
    label: '节点 2（禁拖）',
    draggable: false,
    children: [
      { id: 21, label: '节点 2-1（可拖拽）', draggable: true },
    ],
  },
  {
    id: 3,
    label: '节点 3（默认可拖拽）',
  },
]);

/** allowDrop 演示数据 - allowInner/allowSibling 控制放置类型 */
const allowDropData = ref([
  {
    id: 1,
    label: '容器节点 1（仅可放入内部）',
    allowInner: true,
    allowSibling: false,
    children: [
      { id: 11, label: '叶子 1-1（仅可前后插入）', allowInner: false, allowSibling: true },
      { id: 12, label: '叶子 1-2（仅可前后插入）', allowInner: false, allowSibling: true },
    ],
  },
  {
    id: 2,
    label: '容器节点 2（可放入内部 + 可前后）',
    allowInner: true,
    allowSibling: true,
    children: [
      { id: 21, label: '叶子 2-1（禁放）', allowInner: false, allowSibling: false },
    ],
  },
  {
    id: 3,
    label: '叶子节点 3（仅可前后插入）',
    allowInner: false,
    allowSibling: true,
  },
]);

/** 综合拖拽演示数据 - disabled / 容器 / 叶子 */
const comprehensiveDragData = ref([
  {
    id: 1,
    label: '容器节点 1',
    children: [
      { id: 11, label: '叶子 1-1' },
      { id: 12, label: '叶子 1-2' },
      { id: 13, label: '禁用节点 1-3', disabled: true },
    ],
  },
  {
    id: 2,
    label: '容器节点 2',
    children: [
      { id: 21, label: '叶子 2-1' },
      {
        id: 22,
        label: '子容器 2-2',
        children: [
          { id: 221, label: '叶子 2-2-1' },
        ],
      },
    ],
  },
  {
    id: 3,
    label: '禁用节点 3',
    disabled: true,
    children: [
      { id: 31, label: '叶子 3-1' },
    ],
  },
]);

/** 方法演示数据 */
const methodData = ref([
  {
    id: 1,
    label: '方法演示节点 1',
    children: [
      { id: 11, label: '子节点 1-1' },
      { id: 12, label: '子节点 1-2' },
    ],
  },
  {
    id: 2,
    label: '方法演示节点 2',
    children: [
      { id: 21, label: '子节点 2-1' },
      {
        id: 22,
        label: '子节点 2-2',
        children: [
          { id: 221, label: '孙节点 2-2-1' },
        ],
      },
    ],
  },
  {
    id: 3,
    label: '方法演示节点 3',
  },
]);

// ==================== 虚拟滚动数据 ====================

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

/** 虚拟滚动 + 拖拽数据（50 个根节点） */
const virtualDragData = ref(generateVirtualData(50));

/** 虚拟滚动 + 拖拽 + 复选框数据（50 个根节点） */
const virtualDragCheckData = ref(generateVirtualData(50));

/** 虚拟滚动 + 拖拽 + 复选框 选中 keys */
const virtualDragCheckedKeys = ref<any[]>([]);

/** 虚拟滚动 + 拖拽 + 复选框 check 回调 */
function onVirtualDragCheck(_data: any, info: any) {
  virtualDragCheckedKeys.value = info.checkedKeys;
}

/** 虚拟滚动 + 懒加载初始数据（50 个根节点，均未加载子节点） */
const virtualLazyData = Array.from({ length: 50 }, (_, i) => ({
  id: `lazy-${i}`,
  label: `懒加载根节点 ${i}`,
  isLeaf: false,
}));

// ==================== 懒加载 ====================

/** 懒加载最大层级（根节点为 0，最多加载到第 3 层） */
const LAZY_MAX_LEVEL = 5;

/** 懒加载函数 */
function loadNode(node: any, resolve: (data: any[]) => void) {
  setTimeout(() => {
    const label = node.label || '根';
    // 根节点的 key 为 undefined（data 是数组），用 level 作为兜底生成唯一 id
    const parentKey = node.key;
    // 达到最大层级后返回空数组，节点加载后自然成为叶子节点，不再继续加载
    if ((node.level ?? 0) + 1 >= LAZY_MAX_LEVEL) {
      resolve([]);
      return;
    }
    resolve([
      { id: `${parentKey}-1`, label: `动态加载 - ${label} 1`, isLeaf: true },
      { id: `${parentKey}-2`, label: `动态加载 - ${label} 2`, isLeaf: false },
      { id: `${parentKey}-3`, label: `动态加载 - ${label} 3`, isLeaf: true },
    ]);
  }, 1000);
}

// ==================== 拖拽 ====================

/**
 * 拖拽放置回调
 * @param treeData 该树的根数据数组
 */
function onNodeDrop(
  treeData: any[],
  draggingNode: any,
  dropNode: any,
  dropType: string,
) {
  const movedData = draggingNode.data;
  // 源兄弟列表：非顶层取父节点 children 字段，顶层取根数据
  const fromSiblings = draggingNode.parent?.data?.children ?? treeData;
  const fromIndex = fromSiblings.indexOf(movedData);
  if (fromIndex > -1) fromSiblings.splice(fromIndex, 1);
  if (dropType === 'inner') {
    (dropNode.data.children ??= []).push(movedData);
  } else {
    const toSiblings = dropNode.parent?.data?.children ?? treeData;
    const toIndex = toSiblings.indexOf(dropNode.data);
    toSiblings.splice(
      dropType === 'before' ? toIndex : toIndex + 1,
      0,
      movedData,
    );
  }
  message.success(`${draggingNode.label} 移动到 ${dropNode.label} ${dropType}`);
}

/** 允许拖拽：根据 data.draggable 字段判断 */
function checkDraggable(node: any) {
  return node.data.draggable !== false;
}

/** 允许放置：根据 data.allowInner/allowSibling 判断放置类型 */
function checkDroppable(_draggingNode: any, dropNode: any, type: string) {
  const data = dropNode.data;
  if (type === 'inner') {
    return data.allowInner === true;
  }
  return data.allowSibling === true;
}

/** 综合规则 allowDrag：disabled 节点不可拖拽 */
function checkComprehensiveDrag(node: any) {
  return !node.data.disabled;
}

/** 综合规则 allowDrop：disabled 不可放置；叶子节点仅前后；容器节点仅内部 */
function checkComprehensiveDrop(_draggingNode: any, dropNode: any, type: string) {
  if (dropNode.data.disabled) return false;
  if (type === 'inner') {
    return !dropNode.isLeaf;
  }
  return true;
}

// ==================== 方法调用演示 ====================

/** 方法树引用 */
const methodTreeRef = ref();
/** 虚拟树引用（scrollTo 演示） */
const methodVirtualTreeRef = ref();
/** 方法演示 v-model 状态 */
const methodExpandedKeys = ref<any[]>([]);
const methodCheckedKeys = ref<any[]>([]);
const methodCurrentNodeKey = ref<any>();
/** 方法调用日志 */
const methodLog = ref('');

/** 方法演示节点点击 */
function onMethodNodeClick(data: any) {
  methodLog.value = `点击节点：${data.label} (id=${data.id})`;
}

/** 滚动到节点（autoExpand 自动展开祖先） */
function handleScrollTo() {
  methodTreeRef.value?.scrollTo({ key: 221, align: 'top', autoExpand: true });
  methodLog.value = '滚动到节点 id=221（已自动展开祖先）';
}

/** 虚拟树滚动到节点 */
function handleScrollToVirtual() {
  const targetKey = '50-2-1';
  methodVirtualTreeRef.value?.scrollTo({ key: targetKey, align: 'top', autoExpand: true });
  methodLog.value = `虚拟树滚动到节点 ${targetKey}`;
}

/** 获取半选 keys */
function handleGetHalfChecked() {
  const keys = methodTreeRef.value?.getHalfCheckedKeys();
  methodLog.value = `半选 keys: ${JSON.stringify(keys)}`;
}

/** 获取节点 */
function handleGetNode() {
  const node = methodTreeRef.value?.getNode(1);
  methodLog.value = `节点信息: ${node ? JSON.stringify({ id: node.key, label: node.label, level: node.level }) : '未找到'}`;
}

/** 通过 v-model 设置选中 */
function handleSetCheckedVModel() {
  methodCheckedKeys.value = [11, 12, 21];
  methodLog.value = '通过 v-model:checked-keys 设置选中 id=11,12,21';
}

/** 通过 v-model 设置展开 */
function handleSetExpandedVModel() {
  methodExpandedKeys.value = [1, 2];
  methodLog.value = '通过 v-model:expanded-keys 设置展开 id=1,2';
}

/** 通过 v-model 设置当前节点 */
function handleSetCurrentVModel() {
  methodCurrentNodeKey.value = 2;
  methodLog.value = '通过 v-model:current-node-key 设置当前节点 id=2';
}

/** 直接改 data 追加子节点 */
function handleAppendData() {
  const newNode = {
    id: Date.now(),
    label: `新节点 ${Date.now()}`,
  };
  methodData.value[0].children = methodData.value[0].children || [];
  methodData.value[0].children.push(newNode);
  methodLog.value = `直接改 data 追加子节点到节点 1：${newNode.label}`;
}

/** 直接改 data 移除节点 */
function handleRemoveData() {
  const children = methodData.value[0].children;
  if (children && children.length > 0) {
    const removed = children.pop();
    methodLog.value = `直接改 data 移除节点：${removed?.label ?? '(空)'}`;
  } else {
    methodLog.value = '节点 1 下无子节点可移除';
  }
}

// ==================== 事件监听 ====================

/** 事件日志列表 */
const eventLogs = ref<string[]>([]);

/** 事件日志记录 */
function onEventLog(eventName: string, ...args: any[]) {
  const time = new Date().toLocaleTimeString();
  const parts = args.map((arg) => {
    if (arg == null) return 'null';
    if (typeof arg === 'object' && 'id' in arg) return arg.id;
    if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
      return String(arg);
    }
    return '';
  });
  const info = parts.filter(Boolean).join(' / ');
  eventLogs.value.unshift(`[${time}] ${eventName}${info ? ' - ' + info : ''}`);
  if (eventLogs.value.length > 2000) {
    eventLogs.value.pop();
  }
}

// ==================== 右键菜单 ====================

/** 右键菜单回调 */
function onContextmenu(event: Event, _data: any, node: any) {
  event.preventDefault();
  message.info(`右键点击：${node.label}`);
}
</script>

<style lang="less">
.play-tree {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .play-section {
    margin-bottom: 32px;

    h2 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .play-desc {
      font-size: 13px;
      color: #999;
      margin-bottom: 12px;
    }
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

  .play-border {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 12px;
    min-height: 60px;
  }

  .play-method-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12px;

    .ant-btn {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }

  .play-log {
    margin-top: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 13px;
    font-family: monospace;
    color: #333;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .play-event-log {
    margin-top: 12px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;

    .play-event-log-item {
      font-size: 12px;
      font-family: monospace;
      color: #666;
      line-height: 1.8;
    }
  }

  .play-tree-custom-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 8px;

    .play-tree-custom-label {
      flex: 1;
    }

    .play-tree-custom-action {
      color: #1677ff;
      cursor: pointer;
      font-size: 12px;
      margin-left: 8px;
    }
  }

  .play-tree-card {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background: #fafafa;
    margin: 2px 0;

    .play-tree-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .play-tree-card-title {
      font-weight: 500;
      font-size: 14px;
    }

    .play-tree-card-desc {
      margin-top: 4px;
      font-size: 12px;
      color: #666;
      line-height: 1.6;
    }

    .play-tree-card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;

      .ant-tag {
        margin: 0;
        font-size: 11px;
        line-height: 18px;
        padding: 0 6px;
      }
    }

    .play-tree-card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 6px;
      font-size: 11px;
      color: #999;
    }
  }

  .play-tree-drag-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-right: 8px;

    .play-tree-drag-label {
      flex: 1;
    }

    .play-tree-drag-tags {
      display: flex;
      gap: 4px;
      flex-shrink: 0;

      .ant-tag {
        margin: 0;
        font-size: 11px;
        line-height: 18px;
        padding: 0 6px;
      }
    }
  }
}
</style>
