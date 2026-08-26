<!-- ? Select 选择器 -->
<template>
  <div
    ref="selectRef"
    :class="[ns.b.value, ns.m(selectSize)]"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <me-tooltip
      ref="tooltipRef"
      v-model:visible="tooltipVisible"
      :disabled="actualDisabled"
      :placement="placement"
      effect="light"
      :popper-class="
        [ns.e('popper'), popperUniqueId, props.popperClass].join(' ')
      "
      trigger="click"
      :transition="`${ns.namespace}-zoom-in-top`"
      @show="onDropdownShow"
      @hide="onDropdownHide"
    >
      <!-- 触发器 -->
      <div
        ref="wrapperRef"
        :class="[
          ns.e('wrapper'),
          ns.is('focused', isFocused),
          ns.is('hovering', isHovering),
          ns.is('filterable', filterable),
          ns.is('disabled', actualDisabled),
        ]"
        @mousedown.prevent
        @click.prevent="toggleMenu"
      >
        <!-- 前缀 -->
        <div v-if="$slots.prefix" :class="ns.e('prefix')">
          <slot name="prefix" />
        </div>

        <!-- 选择区域 -->
        <div
          ref="selectionRef"
          :class="[ns.e('selection'), ns.is('responsive', isResponsive)]"
        >
          <!-- 多选：标签列表 -->
          <template v-if="multiple">
            <div
              v-for="item in displayTags"
              :key="String(item.value)"
              :class="ns.e('selected-item')"
            >
              <me-tag
                closable
                :disabled="actualDisabled"
                @close="deleteTag(item)"
              >
                <span :class="ns.e('tags-text')">{{ item.label }}</span>
              </me-tag>
            </div>
            <!-- 折叠标签指示器 -->
            <div
              v-if="overflowTagCount > 0"
              :class="[ns.e('selected-item'), ns.e('tag-overflow')]"
            >
              <me-tag>+{{ overflowTagCount }}</me-tag>
            </div>
          </template>

          <!-- 搜索输入框 -->
          <div
            :class="[
              ns.e('selected-item'),
              ns.e('input-wrapper'),
              ns.is('hidden', !filterable || actualDisabled),
            ]"
          >
            <input
              ref="inputRef"
              v-model="filterQuery"
              type="text"
              :class="ns.e('input')"
              :disabled="actualDisabled"
              :readonly="!filterable"
              :placeholder="''"
              @compositionstart="isComposing = true"
              @compositionend="isComposing = false"
              @keydown="handleKeydown"
              @click.stop="toggleMenu"
            />
          </div>

          <!-- 占位文本 / 选中标签 -->
          <div
            v-if="showDisplayText"
            :class="[
              ns.e('selected-item'),
              ns.e('placeholder'),
              ns.is('transparent', !hasValue || (expanded && !filterQuery)),
            ]"
          >
            <span>{{ displayText }}</span>
          </div>
        </div>

        <!-- 后缀区域 -->
        <div :class="ns.e('suffix')">
          <!-- 清除按钮 -->
          <me-icon
            v-if="showClearIcon"
            :class="[ns.e('caret'), ns.e('icon'), ns.e('clear')]"
            :size="14"
            @click.stop="handleClear"
          >
            <CircleClose />
          </me-icon>
          <!-- 箭头图标 -->
          <me-icon
            v-else
            :class="[ns.e('caret'), ns.e('icon'), ns.is('reverse', expanded)]"
            :size="14"
            @click.stop="handleArrowClick"
          >
            <ArrowDown />
          </me-icon>
        </div>
      </div>

      <!-- 下拉菜单内容 -->
      <template #content>
        <me-select-dropdown
          :options-count="filteredOptionsCount"
          :max-height="MAX_DROPDOWN_HEIGHT"
        >
          <slot></slot>
        </me-select-dropdown>
      </template>
    </me-tooltip>

    <!-- 响应式标签宽度测量层 -->
    <div v-if="isResponsive" :class="ns.e('measure')">
      <div
        v-for="item in selectedItems"
        :key="String(item.value)"
        ref="measureItemRefs"
        :class="ns.e('selected-item')"
      >
        <me-tag closable :disabled="actualDisabled">
          <span :class="ns.e('tags-text')">{{ item.label }}</span>
        </me-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  provide,
  ref,
  shallowRef,
  watch,
} from "vue";
import { ArrowDown, CircleClose } from "@element-plus/icons-vue";
import { useResizeObserver } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

import MeIcon from "@me-ui/components/icon";
import MeSelectDropdown from "./SelectDropdown.vue";
import MeTag from "@me-ui/components/tag";
import MeTooltip from "@me-ui/components/tooltip";
import {
  useFormItem,
  useFormDisabled,
  useFormSize,
} from "@me-ui/components/form/hooks";
import { useNamespace } from "@me-ui/hooks/use-namespace";
import { useFocusController } from "@me-ui/hooks/use-focus-controller";

import { selectEmits, selectProps, type OptionValue } from "./select";
import { MAX_DROPDOWN_HEIGHT, selectKey } from "./constants";
import type { OptionInstance } from "./types";

defineOptions({ name: "MeSelect" });

const props = defineProps(selectProps);
const emit = defineEmits(selectEmits);

/** v-model 绑定值 */
const modelValue = defineModel<OptionValue | OptionValue[] | undefined>({
  default: undefined,
});

const ns = useNamespace("select");
const { formItem } = useFormItem();

/** 实际尺寸 */
const selectSize = useFormSize(computed(() => props.size));

/** 实际禁用状态 */
const actualDisabled = useFormDisabled(computed(() => props.disabled));

/** select 容器引用 */
const selectRef = ref<HTMLElement>();
/** Tooltip 引用 */
const tooltipRef = ref<InstanceType<typeof MeTooltip>>();
/** 搜索输入框引用 */
const inputRef = ref<HTMLInputElement>();
/** 弹出层唯一类名（用于精确查询当前实例的 popper） */
const popperUniqueId = `me-select-popper-${uuidv4()}`;

/** Tooltip 可见性（受控） */
const tooltipVisible = ref<boolean | undefined>(undefined);
/** 是否展开（同步自 tooltipVisible） */
const expanded = computed(() => !!tooltipVisible.value);

/** 是否悬停 */
const isHovering = ref(false);
/** 过滤查询 */
const filterQuery = ref("");
/** 是否正在输入法组合 */
const isComposing = ref(false);
/** 自定义筛选函数 */
const filterMethod = computed(() => props.filterMethod);

/** 触发器 wrapper 引用 */
const wrapperRef = ref<HTMLElement>();

/** 焦点控制器 */
const { isFocused } = useFocusController(inputRef, wrapperRef, {
  disabled: actualDisabled,
  beforeBlur(event) {
    // 焦点移动到弹出层内的可聚焦元素时，不改变触发器中input的isFocused的真状态（和Element Plus保持一致）
    return tooltipRef.value?.isFocusInsideContent(event);
  },
  afterBlur() {
    tooltipVisible.value = false;
    if (props.filterable) {
      filterQuery.value = "";
    }
    formItem?.validate("blur").catch(() => {});
  },
});

/** 选项列表（使用 shallowRef 避免 ref 深层解包 ComputedRef/Ref） */
const options = shallowRef<OptionInstance[]>([]);

/** 是否有值 */
const hasValue = computed(() => {
  const val = modelValue.value;
  if (props.multiple) {
    return Array.isArray(val) && val.length > 0;
  }
  return val !== undefined && val !== null && val !== "";
});

/** 选中项列表（多选） */
const selectedItems = computed<OptionInstance[]>(() => {
  if (!props.multiple) return [];
  const val = modelValue.value;
  if (!Array.isArray(val)) return [];
  const result: OptionInstance[] = [];
  val.forEach((v) => {
    const opt = options.value.find((o) => o.value === v);
    if (opt) result.push(opt);
  });
  return result;
});

/** 选中标签（单选） */
const selectedLabel = computed(() => {
  if (props.multiple) return "";
  const val = modelValue.value;
  if (val === undefined || val === null) return "";
  const opt = options.value.find((o) => o.value === val);
  return opt ? String(opt.label.value) : String(val);
});

/** 是否为响应式最大标签数 */
const isResponsive = computed(() => props.maxTagCount === "responsive");

/** 响应式计算的最大标签数 */
const responsiveMaxCount = ref(Infinity);

/** 实际生效的最大标签数 */
const effectiveMaxCount = computed<number>(() => {
  const val = props.maxTagCount;
  if (val === undefined || val === null) return Infinity;
  if (val === "responsive") return responsiveMaxCount.value;
  const n = Number(val);
  if (isNaN(n) || n < 0) return Infinity;
  return n;
});

/** 多选模式下实际展示的标签列表（受 maxTagCount 限制） */
const displayTags = computed<OptionInstance[]>(() => {
  if (!props.multiple) return [];
  return selectedItems.value.slice(0, effectiveMaxCount.value);
});

/** 多选模式下被折叠的标签数量 */
const overflowTagCount = computed(() => {
  if (!props.multiple) return 0;
  return Math.max(0, selectedItems.value.length - effectiveMaxCount.value);
});

/** 是否显示展示文本 */
const showDisplayText = computed(() => {
  if (isComposing.value) return false;
  if (props.multiple) return !hasValue.value && !filterQuery.value;
  return !filterQuery.value;
});

/** 当前展示文本（有值时显示选中标签，无值时显示占位文本） */
const displayText = computed(() => {
  if (!props.multiple && hasValue.value) return selectedLabel.value;
  return props.placeholder;
});

/** 是否显示清除图标 */
const showClearIcon = computed(() => {
  return (
    props.clearable &&
    hasValue.value &&
    (isHovering.value || isFocused.value) &&
    !actualDisabled.value
  );
});

/** 过滤后的选项数量 */
const filteredOptionsCount = computed(() => {
  return options.value.filter((o) => o.visible.value).length;
});

/** 添加选项 */
function addOption(option: OptionInstance) {
  options.value = [...options.value, option];
}

/** 移除选项 */
function removeOption(value: OptionValue) {
  options.value = options.value.filter((o) => o.value !== value);
}

/** 选择选项 */
function selectOption(option: OptionInstance) {
  if (props.multiple) {
    const val = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
    const index = val.indexOf(option.value);
    if (index > -1) {
      val.splice(index, 1);
    } else {
      val.push(option.value);
    }
    modelValue.value = val;
    emit("change", val);
    if (props.filterable) {
      filterQuery.value = "";
    }
  } else {
    modelValue.value = option.value;
    emit("change", option.value);
    tooltipVisible.value = false;
  }
  formItem?.validate("change").catch(() => {});
}

/** 点击箭头图标 */
function handleArrowClick() {
  if (actualDisabled.value) return;
  tooltipVisible.value = !expanded.value;
}

/** 切换菜单 */
function toggleMenu() {
  if (actualDisabled.value) return;
  if (expanded.value) {
    if (props.filterable && inputRef.value === document.activeElement) {
      return;
    }
    tooltipVisible.value = false;
  } else {
    openDropdown();
  }
}

/** 清空 */
function handleClear() {
  const newVal = props.multiple ? [] : undefined;
  modelValue.value = newVal;
  filterQuery.value = "";
  emit("clear");
  emit("change", newVal);
  formItem?.validate("change").catch(() => {});
}

/** 删除标签 */
function deleteTag(option: OptionInstance) {
  if (actualDisabled.value) return;
  const val = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
  const index = val.indexOf(option.value);
  if (index > -1) {
    val.splice(index, 1);
    modelValue.value = val;
    emit("removeTag", option.value);
    emit("change", val);
    formItem?.validate("change").catch(() => {});
  }
}

/** 键盘导航 */
function handleKeydown(evt: KeyboardEvent) {
  if (actualDisabled.value) return;

  if (evt.key === "Backspace" && props.multiple && !filterQuery.value) {
    const val = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
    if (val.length > 0) {
      val.pop();
      modelValue.value = val;
      emit("change", val);
    }
  }
}

/** 打开下拉菜单（先设置宽度再展开，避免闪烁） */
function openDropdown() {
  updatePopperMinWidth();
  tooltipVisible.value = true;
  if (props.filterable) {
    nextTick(() => inputRef.value?.focus());
  }
}

/** Tooltip show 回调 */
function onDropdownShow() {
  emit("visibleChange", true);
}

/** Tooltip hide 回调 */
function onDropdownHide() {
  emit("visibleChange", false);
  if (props.filterable) {
    filterQuery.value = "";
  }
}

/** 更新弹出层 min-width 与触发器一致 */
function updatePopperMinWidth() {
  if (!selectRef.value) return;
  const selectWidth = selectRef.value.getBoundingClientRect().width;
  const popper = document.querySelector(`.${popperUniqueId}`);
  if (popper) {
    (popper as HTMLElement).style.minWidth = `${selectWidth}px`;
  }
}

/** 选择区域引用 */
const selectionRef = ref<HTMLElement>();

/** 测量层标签元素引用数组 */
const measureItemRefs = ref<HTMLElement[]>([]);

/** +N 折叠标签预估宽度 */
const OVERFLOW_TAG_ESTIMATE_WIDTH = 50;

/** 存储每个标签的测量宽度（仅在选中项变化时更新） */
const tagWidths = ref<number[]>([]);

/** 上次测量的容器宽度（避免重复计算） */
let lastMeasuredWidth = 0;

/** 测量所有标签的实际宽度（需要 DOM 已更新） */
function measureTagWidths() {
  const refs = measureItemRefs.value;
  if (refs.length === 0) {
    tagWidths.value = [];
    return;
  }
  tagWidths.value = refs.map((el) => el?.offsetWidth ?? 0);
}

/** 根据已测量的标签宽度和当前容器宽度计算可显示数量（纯计算，无 DOM 查询） */
function calculateResponsiveCount() {
  if (!isResponsive.value || !selectRef.value) return;

  const widths = tagWidths.value;
  if (widths.length === 0) {
    responsiveMaxCount.value = Infinity;
    return;
  }

  // 计算可用宽度（selection 容器宽度）
  if (!selectionRef.value) return;
  const availableWidth = selectionRef.value.clientWidth;

  // 尝试全部放下
  const totalWidth = widths.reduce((sum, w) => sum + w + 4, 0);
  if (totalWidth <= availableWidth) {
    responsiveMaxCount.value = Infinity;
    return;
  }

  // 需要预留 +N 标签的空间
  const availableForTags = availableWidth - OVERFLOW_TAG_ESTIMATE_WIDTH;

  let accumulated = 0;
  let count = 0;
  for (let i = 0; i < widths.length; i++) {
    accumulated += widths[i] + 4;
    if (accumulated > availableForTags) break;
    count++;
  }

  responsiveMaxCount.value = count;
}

/** 监听选中项变化，重新测量标签宽度并计算 */
watch(
  [selectedItems, isResponsive],
  () => {
    if (isResponsive.value) {
      measureTagWidths();
      calculateResponsiveCount();
    }
  },
  { flush: "post" },
);

/** 监听容器尺寸变化，同步计算（使用已存储的标签宽度，无需 nextTick） */
useResizeObserver(selectRef, (entries) => {
  if (!isResponsive.value) return;
  const width = entries[0].contentRect.width;
  if (width !== lastMeasuredWidth) {
    lastMeasuredWidth = width;
    calculateResponsiveCount();
  }
});

onMounted(() => {
  if (isResponsive.value) {
    /**
     * 父组件初始 render — 此时 options 为空，selectedItems 为空，测量层渲染 0 个元素
     * 子组件 setup — 调用 addOption，options 变更，触发父组件重新渲染（调度为微任务）
     * 子组件 mounted
     * 父组件 mounted — onMounted 同步触发，但此时步骤 2 调度的重渲染还未刷新到 DOM
     */
    nextTick(() => {
      measureTagWidths();
      calculateResponsiveCount();
    });
  }
});

/** 提供上下文 */
provide(selectKey, {
  modelValue,
  multiple: computed(() => props.multiple),
  filterQuery,
  filterMethod,
  isComposing,
  addOption,
  removeOption,
  selectOption,
});

defineExpose({
  /** 手动聚焦 */
  focus: () => inputRef.value?.focus(),
  /** 手动失焦 */
  blur: () => inputRef.value?.blur(),
  /** 打开下拉 */
  show: () => {
    tooltipVisible.value = true;
  },
  /** 关闭下拉 */
  hide: () => {
    tooltipVisible.value = false;
  },
});
</script>
