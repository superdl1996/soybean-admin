<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import type { CodeProps } from 'naive-ui';
import { computed, toValue } from 'vue';

defineOptions({
  inheritAttrs: false
});

interface BaseCodeProps {
  nCode: CodeProps;
}

const { nCode } = defineProps<BaseCodeProps>();
const { copy } = useClipboard();

const code = computed(() => toValue(nCode.code)?.trim());
const copyCode = async () => {
  await copy(toValue(code.value)?.trim() || '');
  window.$message?.success('复制成功');
};

defineExpose({
  /** 复制代码 */
  copyCode
});
</script>

<template>
  <div class="pos-relative h-100%">
    <NFloatButton type="primary" position="absolute" :right="60" :top="0" shape="square" width="80" @click="copyCode">
      <div class="flex items-center font-size-14px">复制</div>
    </NFloatButton>
    <NCode class="h-100% overflow-y-auto" :show-line-numbers="true" language="TypeScript" v-bind="nCode" :code="code" />
  </div>
</template>

<style scoped></style>
