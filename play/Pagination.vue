<!-- ? Pagination 分页组件示例 -->
<template>
  <div class="play-pagination">
    <h1>MePagination 分页</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">通过 total 和 pageSize 计算总页数</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage0" v-model:page-size="pageSize0" :total="100" />
      </div>
    </section>

    <!-- v-model 当前页 -->
    <section class="play-section">
      <h2>v-model:current-page 双向绑定</h2>
      <p class="play-desc">当前页码：{{ currentPage1 }}</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize1" :total="200" />
      </div>
    </section>

    <!-- 带背景色 -->
    <section class="play-section">
      <h2>带背景色</h2>
      <p class="play-desc">设置 background 属性</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage2" v-model:page-size="pageSize2b" :total="300" background />
      </div>
    </section>

    <!-- 自定义 layout -->
    <section class="play-section">
      <h2>自定义 layout</h2>
      <p class="play-desc">仅显示 prev、pager、next</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage3" v-model:page-size="pageSize3" :total="500" layout="prev, pager, next" />
      </div>
    </section>

    <!-- 完整 layout + 右对齐 -->
    <section class="play-section">
      <h2>完整 layout + 右对齐</h2>
      <p class="play-desc">layout="prev, pager, next, sizes, ->, total, jumper"</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize" :total="1000" :page-sizes="[10, 20, 50, 100]" layout="prev, pager, next, sizes, ->, total, jumper" />
      </div>
    </section>

    <!-- sizes 每页条数 -->
    <section class="play-section">
      <h2>sizes 每页条数选择</h2>
      <p class="play-desc">当前每页条数：{{ pageSize5 }}</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage9" v-model:page-size="pageSize5" :total="500" :page-sizes="[10, 20, 30, 50]" layout="prev, pager, next, sizes" />
      </div>
    </section>

    <!-- pagerCount 折叠 -->
    <section class="play-section">
      <h2>pagerCount 折叠</h2>
      <p class="play-desc">pagerCount=5，总页数超过时折叠显示省略号</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage5" v-model:page-size="pageSize5b" :total="1000" :pager-count="5" />
      </div>
    </section>

    <!-- 禁用 -->
    <section class="play-section">
      <h2>禁用</h2>
      <p class="play-desc">设置 disabled 属性</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage6" v-model:page-size="pageSize6" :total="100" disabled />
      </div>
    </section>

    <!-- 单页隐藏 -->
    <section class="play-section">
      <h2>单页隐藏</h2>
      <p class="play-desc">hideOnSinglePage=true，只有一页时不显示分页</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage10" v-model:page-size="pageSize10" :total="5" hide-on-single-page />
      </div>
    </section>

    <!-- 自定义文字 -->
    <section class="play-section">
      <h2>自定义上/下一页文字</h2>
      <p class="play-desc">通过 prevText / nextText 设置</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage7" v-model:page-size="pageSize7" :total="100" prev-text="上一页" next-text="下一页" />
      </div>
    </section>

    <!-- 事件回调 -->
    <section class="play-section">
      <h2>事件回调</h2>
      <p class="play-desc">current-change: {{ eventLog }}</p>
      <div class="play-border">
        <me-pagination v-model:current-page="currentPage8" v-model:page-size="pageSize8" :total="100" @current-change="onCurrentChange" @prev-click="onPrevClick" @next-click="onNextClick" />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

/** 基础用法当前页 */
const currentPage0 = ref(1);
/** 基础用法每页条数 */
const pageSize0 = ref(10);
/** v-model 当前页 */
const currentPage1 = ref(1);
/** v-model 每页条数 */
const pageSize1 = ref(10);
/** v-model 当前页 */
const currentPage2 = ref(1);
/** 自定义 layout 当前页 */
const currentPage3 = ref(1);
/** 自定义 layout 每页条数 */
const pageSize3 = ref(10);
/** 完整 layout 当前页 */
const currentPage4 = ref(1);
/** pagerCount 折叠当前页 */
const currentPage5 = ref(1);
/** 禁用当前页 */
const currentPage6 = ref(3);
/** 禁用每页条数 */
const pageSize6 = ref(10);
/** 自定义文字当前页 */
const currentPage7 = ref(1);
/** 自定义文字每页条数 */
const pageSize7 = ref(10);
/** 事件回调当前页 */
const currentPage8 = ref(1);
/** 事件回调每页条数 */
const pageSize8 = ref(10);
/** sizes 当前页 */
const currentPage9 = ref(1);
/** 完整 layout 每页条数 */
const pageSize = ref(10);
/** sizes 每页条数 */
const pageSize5 = ref(10);

/** 单页隐藏当前页 */
const currentPage10 = ref(1);
/** 单页隐藏每页条数 */
const pageSize10 = ref(10);
/** 带背景色每页条数 */
const pageSize2b = ref(10);
/** pagerCount 折叠每页条数 */
const pageSize5b = ref(10);
/** 事件日志 */
const eventLog = ref('');

function onCurrentChange(val: number) {
  eventLog.value = `当前页变为 ${val}`;
}

function onPrevClick(val: number) {
  eventLog.value = `点击上一页，页码 ${val}`;
}

function onNextClick(val: number) {
  eventLog.value = `点击下一页，页码 ${val}`;
}

</script>

<style lang="less" scoped>
.play-pagination {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.play-section {
  margin-bottom: 32px;

  h2 {
    font-size: 16px;
    margin-bottom: 8px;
  }
}

.play-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.play-border {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
