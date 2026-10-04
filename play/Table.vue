<template>
  <div class="play-table">
    <!-- 基础表格 -->
    <h2 class="play-table-title">基础表格</h2>
    <me-table :data="basicData">
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column name="age" label="年龄" :width="100" sort />
      <me-table-column name="address" label="地址" />
    </me-table>

    <!-- 不同尺寸 -->
    <h2 class="play-table-title">不同尺寸</h2>
    <div class="play-table-toolbar">
      <me-button size="small" @click="size = 'large'">large</me-button>
      <me-button size="small" @click="size = 'default'">default</me-button>
      <me-button size="small" @click="size = 'small'">small</me-button>
    </div>
    <me-table :data="basicData" :size="size">
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column name="age" label="年龄" :width="100" />
      <me-table-column name="address" label="地址" />
    </me-table>

    <!-- 选择 + 高亮当前行 -->
    <h2 class="play-table-title">选择表格（高亮当前行）</h2>
    <div class="play-table-toolbar">
      <me-button size="small" @click="toggleAllSelection">全选/取消全选</me-button>
      <me-button size="small" @click="clearSelection">清空选择</me-button>
      <me-button size="small" @click="getSelectionRows">获取选中行</me-button>
      <me-button size="small" @click="clearSort">清除排序</me-button>
      <span class="play-table-count">选中数量：{{ selectionRows.length }}</span>
    </div>
    <me-table
      ref="selectionTableRef"
      :data="basicData"
      @select="onSelect"
      @select-all="onSelectAll"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange"
      @body-cell-click="onCellClick"
      @header-cell-click="onHeaderClick"
      @sort-change="onSortChange"
    >
      <me-table-column type="selection" :width="50" :selectable-fn="checkSelectable" />
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column name="age" label="年龄" :width="100" sort />
      <me-table-column name="address" label="地址" />
    </me-table>

    <!-- 自定义列模板 + formatter -->
    <h2 class="play-table-title">自定义列模板 + formatter</h2>
    <me-table :data="basicData">
      <me-table-column name="name" label="姓名" :width="120">
        <template #body="{ row }">
          <strong>{{ row.name }}</strong>
        </template>
      </me-table-column>
      <me-table-column name="age" label="年龄" :width="100" align="center" />
      <me-table-column name="address" label="地址">
        <template #body="{ row }">
          <span class="play-table-link">{{ row.address }}</span>
        </template>
      </me-table-column>
      <me-table-column name="status" label="状态" :width="100" :formatter="statusFormatter" />
      <me-table-column label="操作" :width="180">
        <template #body="{ row }">
          <me-button type="primary" size="small" @click="handleEdit(row)">编辑</me-button>
          <me-button type="danger" size="small" @click="handleDelete(row)">删除</me-button>
        </template>
      </me-table-column>
    </me-table>

    <!-- 自定义表头 -->
    <h2 class="play-table-title">自定义表头</h2>
    <me-table :data="basicData">
      <me-table-column name="name" label="姓名" :width="120">
        <template #header="{ column }">
          <span style="color: #409eff; font-weight: bold">{{ column.label }}</span>
        </template>
      </me-table-column>
      <me-table-column name="age" label="年龄" :width="100">
        <template #header>
          <span>年龄 ↕</span>
        </template>
      </me-table-column>
      <me-table-column name="address" label="地址">
        <template #header="{ column }">
          <span>{{ column.label }}</span>
          <me-button size="small" type="primary" plain @click.stop="addLog('点击了地址表头按钮')">筛选</me-button>
        </template>
      </me-table-column>
    </me-table>

    <!-- 自定义排序函数 -->
    <h2 class="play-table-title">自定义排序函数</h2>
    <p class="play-table-tip">点击「年龄」列排序时，使用自定义比较函数：30 岁排最前，其次按年龄升序</p>
    <me-table :data="basicData">
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column name="age" label="年龄" :width="100" :sort="customAgeSort" />
      <me-table-column name="address" label="地址" />
    </me-table>

    <!-- 固定列 -->
    <h2 class="play-table-title">固定列（横向滚动）</h2>
    <me-table :data="fixedColumnData" :height="300">
      <me-table-column name="name" label="姓名" :width="120" fixed="left" />
      <me-table-column name="age" label="年龄" :width="100" />
      <me-table-column name="gender" label="性别" :width="80" />
      <me-table-column name="phone" label="手机号" :width="150" />
      <me-table-column name="email" label="邮箱" :width="200" />
      <me-table-column name="address" label="地址" :min-width="300" />
      <me-table-column name="company" label="公司" :width="180" />
      <me-table-column name="position" label="职位" :width="150" />
      <me-table-column name="salary" label="薪资" :width="120" />
      <me-table-column label="操作" :width="160" fixed="right">
        <template #body="{ row }">
          <me-button type="primary" size="small" @click="handleEdit(row)">编辑</me-button>
          <me-button type="danger" size="small" @click="handleDelete(row)">删除</me-button>
        </template>
      </me-table-column>
    </me-table>

    <!-- 多级表头 -->
    <h2 class="play-table-title">多级表头</h2>
    <me-table :data="fixedColumnData">
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column label="基本信息">
        <me-table-column name="age" label="年龄" :width="100" sort />
        <me-table-column name="gender" label="性别" :width="80" />
      </me-table-column>
      <me-table-column label="联系方式">
        <me-table-column name="phone" label="手机号" :width="150" />
        <me-table-column name="email" label="邮箱" :width="200" />
      </me-table-column>
      <me-table-column name="address" label="地址" :min-width="250" />
    </me-table>

    <!-- 多级表头 + selection -->
    <h2 class="play-table-title">多级表头 + selection</h2>
    <me-table :data="fixedColumnData" @selection-change="onSelectionChange">
      <me-table-column type="selection" :width="50" />
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column label="基本信息">
        <me-table-column name="age" label="年龄" :width="100" sort />
        <me-table-column name="gender" label="性别" :width="80" />
      </me-table-column>
      <me-table-column label="联系方式">
        <me-table-column name="phone" label="手机号" :width="150" />
        <me-table-column name="email" label="邮箱" :width="200" />
      </me-table-column>
      <me-table-column name="address" label="地址" :min-width="250" />
    </me-table>

    <!-- 对齐方式 -->
    <h2 class="play-table-title">对齐方式（align + header-align）</h2>
    <p class="play-table-tip">align 控制表体对齐，header-align 控制表头对齐；header-align 未设置时跟随 align</p>
    <me-table :data="basicData">
      <me-table-column name="name" label="姓名（left/left）" :width="160" align="left" header-align="left" />
      <me-table-column name="age" label="年龄（center/center）" :width="160" align="center" header-align="center" />
      <me-table-column name="address" label="地址（left/right）" :min-width="200" align="left" header-align="right" />
      <me-table-column name="status" label="状态（right/left）" :width="160" align="right" header-align="left" :formatter="statusFormatter" />
    </me-table>

    <!-- 对齐方式 + 多级表头 -->
    <h2 class="play-table-title">对齐方式 + 多级表头</h2>
    <p class="play-table-tip">分组列设置 header-align，子列各自设置 align 和 header-align</p>
    <me-table :data="fixedColumnData">
      <me-table-column name="name" label="姓名" :width="120" align="center" header-align="center" />
      <me-table-column label="基本信息" header-align="center">
        <me-table-column name="age" label="年龄" :width="100" align="right" header-align="right" sort />
        <me-table-column name="gender" label="性别" :width="80" align="center" header-align="left" />
      </me-table-column>
      <me-table-column label="联系方式" header-align="right">
        <me-table-column name="phone" label="手机号" :width="150" align="left" header-align="center" />
        <me-table-column name="email" label="邮箱" :min-width="200" align="right" header-align="right" />
      </me-table-column>
    </me-table>

    <!-- 三级表头 -->
    <h2 class="play-table-title">三级表头</h2>
    <me-table :data="fixedColumnData">
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column label="个人信息">
        <me-table-column label="基本">
          <me-table-column name="age" label="年龄" :width="100" />
          <me-table-column name="gender" label="性别" :width="80" />
        </me-table-column>
        <me-table-column label="联系">
          <me-table-column name="phone" label="手机号" :width="150" />
          <me-table-column name="email" label="邮箱" :width="200" />
        </me-table-column>
      </me-table-column>
      <me-table-column label="工作信息">
        <me-table-column name="company" label="公司" :width="180" />
        <me-table-column name="position" label="职位" :min-width="150" />
        <me-table-column name="salary" label="薪资" :width="120" />
      </me-table-column>
    </me-table>

    <!-- 多级表头 + 固定列 -->
    <h2 class="play-table-title">多级表头 + 固定列</h2>
    <me-table :data="fixedColumnData" :height="300">
      <me-table-column name="name" label="姓名" :width="120" fixed="left" />
      <me-table-column label="个人信息" fixed="left">
        <me-table-column name="age" label="年龄" :width="100" sort />
        <me-table-column name="gender" label="性别" :width="80" />
      </me-table-column>
      <me-table-column label="联系方式">
        <me-table-column name="phone" label="手机号" :width="150" />
        <me-table-column name="email" label="邮箱" :width="200" />
      </me-table-column>
      <me-table-column label="工作信息">
        <me-table-column name="company" label="公司" :width="180" />
        <me-table-column name="position" label="职位" :min-width="150" />
      </me-table-column>
      <me-table-column name="salary" label="薪资" :width="120" fixed="right" />
    </me-table>

    <!-- 合并单元格 -->
    <h2 class="play-table-title">合并单元格（多种合并形式）</h2>
    <p class="play-table-tip">
      1. 大区列：按字段值合并行（rowspan）<br>
      2. 省份列：按字段值合并行（rowspan），含小计/汇总行<br>
      3. 小计行：省份~合计 5 列合并为单个单元格（colspan）<br>
      4. 汇总行：城市~合计 4 列合并为单个单元格（colspan）<br>
      5. 备注列：按相邻相同值合并行（rowspan）
    </p>
    <me-table :data="spanData" :span-method="spanMethod">
      <me-table-column name="region" label="大区" :width="100" />
      <me-table-column name="province" label="省份" :width="100" />
      <me-table-column name="city" label="城市" :width="100" />
      <me-table-column name="q1" label="Q1销售额" :width="120" />
      <me-table-column name="q2" label="Q2销售额" :width="120" />
      <me-table-column name="total" label="上半年合计" :width="120" />
      <me-table-column name="remark" label="备注" :min-width="120" />
    </me-table>

    <!-- 空数据 -->
    <h2 class="play-table-title">空数据</h2>
    <me-table :data="emptyData">
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column name="age" label="年龄" :width="100" />
      <me-table-column name="address" label="地址" />
    </me-table>

    <!-- 自定义空数据 -->
    <h2 class="play-table-title">自定义空数据</h2>
    <me-table :data="emptyData">
      <me-table-column name="name" label="姓名" :width="120" />
      <me-table-column name="age" label="年龄" :width="100" />
      <me-table-column name="address" label="地址" />
      <template #empty>
        <div class="play-table-custom-empty">
          <me-button type="primary" size="small" @click="addLog('点击了空数据按钮')">添加数据</me-button>
        </div>
      </template>
    </me-table>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DefaultRow, SpanInfo } from '@me-ui/components/table';

interface TableRow {
  id: number;
  name: string;
  age: number;
  address: string;
  status: number;
}

/** 表格尺寸 */
const size = ref<'large' | 'default' | 'small'>('default');

/** 基础数据 */
const basicData = ref<TableRow[]>([
  { id: 1, name: '张三', age: 25, address: '北京市朝阳区', status: 1 },
  { id: 2, name: '李四', age: 30, address: '上海市浦东新区', status: 0 },
  { id: 3, name: '王五', age: 28, address: '广州市天河区', status: 1 },
  { id: 4, name: '赵六', age: 35, address: '深圳市南山区', status: 0 },
  { id: 5, name: '孙七', age: 22, address: '杭州市西湖区', status: 1 },
]);

/** 固定列数据 */
interface FixedColumnRow extends TableRow {
  /** 性别 */
  gender: string;
  /** 手机号 */
  phone: string;
  /** 邮箱 */
  email: string;
  /** 公司 */
  company: string;
  /** 职位 */
  position: string;
  /** 薪资 */
  salary: string;
}

const fixedColumnData = ref<FixedColumnRow[]>([
  { id: 1, name: '张三', age: 25, address: '北京市朝阳区建国路 88 号', status: 1, gender: '男', phone: '13800138001', email: 'zhangsan@example.com', company: '科技有限公司', position: '前端工程师', salary: '15K' },
  { id: 2, name: '李四', age: 30, address: '上海市浦东新区世纪大道 100 号', status: 0, gender: '女', phone: '13800138002', email: 'lisi@example.com', company: '互联网集团', position: '后端工程师', salary: '20K' },
  { id: 3, name: '王五', age: 28, address: '广州市天河区天河路 200 号', status: 1, gender: '男', phone: '13800138003', email: 'wangwu@example.com', company: '数据智能', position: '产品经理', salary: '18K' },
  { id: 4, name: '赵六', age: 35, address: '深圳市南山区科技园 300 号', status: 0, gender: '男', phone: '13800138004', email: 'zhaoliu@example.com', company: '云计算中心', position: '架构师', salary: '30K' },
  { id: 5, name: '孙七', age: 22, address: '杭州市西湖区文三路 50 号', status: 1, gender: '女', phone: '13800138005', email: 'sunqi@example.com', company: '电商平台', position: 'UI 设计师', salary: '12K' },
  { id: 6, name: '周八', age: 27, address: '成都市武侯区天府大道 150 号', status: 1, gender: '男', phone: '13800138006', email: 'zhouba@example.com', company: '智能硬件', position: '测试工程师', salary: '14K' },
  { id: 7, name: '吴九', age: 32, address: '武汉市洪山区光谷大道 180 号', status: 0, gender: '女', phone: '13800138007', email: 'wujiu@example.com', company: '金融科技', position: '数据分析师', salary: '22K' },
  { id: 8, name: '郑十', age: 29, address: '南京市鼓楼区中山路 66 号', status: 1, gender: '男', phone: '13800138008', email: 'zhengshi@example.com', company: '安全科技', position: '运维工程师', salary: '16K' },
]);

/** 空数据 */
const emptyData = ref<TableRow[]>([]);

/** 合并单元格数据 */
interface SpanRow {
  /** ID */
  id: number;
  /** 大区 */
  region: string;
  /** 省份 */
  province: string;
  /** 城市 */
  city: string;
  /** Q1 销售额 */
  q1: number;
  /** Q2 销售额 */
  q2: number;
  /** 上半年合计 */
  total: number;
  /** 备注 */
  remark: string;
}

const spanData = ref<SpanRow[]>([
  { id: 1, region: '华东', province: '江苏', city: '南京', q1: 100, q2: 120, total: 220, remark: '达标' },
  { id: 2, region: '华东', province: '江苏', city: '苏州', q1: 80, q2: 90, total: 170, remark: '达标' },
  { id: 3, region: '华东', province: '浙江', city: '杭州', q1: 150, q2: 130, total: 280, remark: '优秀' },
  { id: 4, region: '华东', province: '浙江', city: '宁波', q1: 70, q2: 85, total: 155, remark: '待提升' },
  { id: 5, region: '华东', province: '华东小计', city: '—', q1: 400, q2: 425, total: 825, remark: '—' },
  { id: 6, region: '华南', province: '广东', city: '广州', q1: 200, q2: 180, total: 380, remark: '优秀' },
  { id: 7, region: '华南', province: '广东', city: '深圳', q1: 190, q2: 210, total: 400, remark: '优秀' },
  { id: 8, region: '华南', province: '福建', city: '福州', q1: 60, q2: 70, total: 130, remark: '待提升' },
  { id: 9, region: '华南', province: '福建', city: '厦门', q1: 55, q2: 65, total: 120, remark: '待提升' },
  { id: 10, region: '华南', province: '汇总', city: '华南汇总', q1: 505, q2: 525, total: 1030, remark: '—' },
]);

/** 计算指定列按字段值合并的行跨度（相邻相同值合并） */
function getRowspanByField(rowIndex: number, field: keyof SpanRow): number {
  const current = spanData.value[rowIndex];
  const prev = spanData.value[rowIndex - 1];
  if (prev && prev[field] === current[field]) {
    return 0;
  }
  let rowspan = 1;
  for (let i = rowIndex + 1; i < spanData.value.length; i++) {
    if (spanData.value[i][field] === current[field]) {
      rowspan++;
    } else {
      break;
    }
  }
  return rowspan;
}

/** 小计行索引 */
const SUMMARY_ROW_INDEX = 4;

/** 汇总行索引 */
const TOTAL_ROW_INDEX = 9;

/** 合并单元格方法：多种合并形式 */
function spanMethod({ rowIndex, columnIndex }: { row: DefaultRow; rowIndex: number; columnIndex: number }): SpanInfo {
  // 小计行：省份 + 城市 + Q1 + Q2 + 合计 = colspan 5
  if (rowIndex === SUMMARY_ROW_INDEX) {
    if (columnIndex === 1) {
      return { rowspan: 1, colspan: 5 };
    }
    if (columnIndex >= 2 && columnIndex <= 5) {
      return { rowspan: 0, colspan: 0 };
    }
  }

  // 汇总行：城市 + Q1 + Q2 + 合计 = colspan 4
  if (rowIndex === TOTAL_ROW_INDEX) {
    if (columnIndex === 2) {
      return { rowspan: 1, colspan: 4 };
    }
    if (columnIndex >= 3 && columnIndex <= 5) {
      return { rowspan: 0, colspan: 0 };
    }
  }

  // 大区列：按 region 字段值合并行
  if (columnIndex === 0) {
    return { rowspan: getRowspanByField(rowIndex, 'region'), colspan: 1 };
  }

  // 省份列：按 province 字段值合并行
  if (columnIndex === 1) {
    return { rowspan: getRowspanByField(rowIndex, 'province'), colspan: 1 };
  }

  // 备注列：按 remark 字段值合并相邻行
  if (columnIndex === 6) {
    return { rowspan: getRowspanByField(rowIndex, 'remark'), colspan: 1 };
  }

  return { rowspan: 1, colspan: 1 };
}

/** 选中行 */
const selectionRows = ref<DefaultRow[]>([]);

/** 选择表格引用 */
const selectionTableRef = ref();

/** 添加日志 */
function addLog(message: string) {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

/** 可选判断 */
function checkSelectable(_row: DefaultRow, index: number): boolean {
  return index !== 0;
}

/** 状态格式化 */
function statusFormatter(row: DefaultRow): string {
  return row.status === 1 ? '启用' : '禁用';
}

/** 自定义年龄排序：30 岁排最前，其次按年龄升序 */
function customAgeSort(a: DefaultRow, b: DefaultRow): number {
  const priority = (age: number) => (age === 30 ? 0 : age);
  return priority(a.age) - priority(b.age);
}

/** 全选/取消全选 */
function toggleAllSelection() {
  selectionTableRef.value?.toggleAllSelection();
  addLog('调用 toggleAllSelection');
}

/** 清空选择 */
function clearSelection() {
  selectionTableRef.value?.clearSelection();
  addLog('调用 clearSelection');
}

/** 获取选中行 */
function getSelectionRows() {
  const rows = selectionTableRef.value?.getSelectionRows();
  addLog(`选中行：${JSON.stringify(rows?.map((r: DefaultRow) => r.name) || [])}`);
}

/** 清除排序 */
function clearSort() {
  selectionTableRef.value?.clearSort();
  addLog('调用 clearSort');
}

/** 选择行事件 */
function onSelect(selection: DefaultRow[], row: DefaultRow) {
  addLog(`select: 选中 ${row.name}，当前选中 ${selection.length} 行`);
}

/** 全选事件 */
function onSelectAll(selection: DefaultRow[]) {
  addLog(`select-all: 选中 ${selection.length} 行`);
}

/** 选择变化事件 */
function onSelectionChange(selection: DefaultRow[]) {
  selectionRows.value = selection;
  addLog(`selection-change: ${selection.length} 行`);
}

/** 当前行变化事件 */
function onCurrentChange(currentRow: DefaultRow | null, oldRow: DefaultRow | null) {
  addLog(`current-change: ${currentRow?.name ?? 'null'} <- ${oldRow?.name ?? 'null'}`);
}

/** 单元格点击事件 */
function onCellClick(row: DefaultRow, column: any) {
  addLog(`body-cell-click: ${row.name} - ${column.label}`);
}

/** 表头点击事件 */
function onHeaderClick(column: any) {
  addLog(`header-cell-click: ${column.label}`);
}

/** 排序变化事件 */
function onSortChange(column: any) {
  addLog(`sort-change: name=${column.name}, order=${column.order}`);
}

/** 编辑 */
function handleEdit(row: DefaultRow) {
  addLog(`编辑: ${row.name}`);
}

/** 删除 */
function handleDelete(row: DefaultRow) {
  addLog(`删除: ${row.name}`);
}
</script>

<style scoped>
.play-table {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.play-table-title {
  margin: 24px 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.play-table-title:first-child {
  margin-top: 0;
}

.play-table-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.play-table-toolbar > * {
  margin-right: 8px;
  margin-bottom: 4px;
}

.play-table-count {
  font-size: 13px;
  color: #86909c;
}

.play-table-tip {
  margin: 0 0 12px;
  font-size: 13px;
  color: #86909c;
}

.play-table-link {
  color: #409eff;
}

.play-table-custom-empty {
  padding: 16px 0;
}
</style>
