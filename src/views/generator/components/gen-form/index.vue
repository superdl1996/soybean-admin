<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormModel } from '../shared';
import { tableTypeMap } from './data';

interface Emits {
  /** 提交 */
  (e: 'submit'): void;
  /** 提交并下载 */
  (e: 'submitAndDownload'): void;
}

defineOptions({
  name: 'GenForm'
});

const emit = defineEmits<Emits>();
const model = defineModel<FormModel>('model', { required: true });
const expandedNames = ref(['role-search']);

watch(
  () => model.value.tableType,
  () => {
    model.value.fileName = model.value.tableType;
    model.value.resetTsName = `${model.value.tableType}ListItem`;
    switch (model.value.tableType) {
      case tableTypeMap.DEFAULT:
        model.value.resetTsName = '';
        model.value.moduleName = '';
        break;
      case tableTypeMap.MAIN:
        model.value.moduleName = '主表';
        break;
      case tableTypeMap.SUB:
        model.value.moduleName = '副表';
        break;
      default:
        break;
    }
  }
);

/** 移入 */
const mouseenter = () => {
  expandedNames.value = ['role-search'];
};

/** 移出 */
const mouseleave = () => {
  // expandedNames.value = [];
};
const handleClick = () => {
  expandedNames.value = !expandedNames.value.length ? ['role-search'] : [];
};

const submit = () => {
  expandedNames.value = [];
  emit('submit');
};

const submitAndDownload = () => {
  emit('submitAndDownload');
};
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper" @mouseenter.self="mouseenter" @mouseleave="mouseleave">
    <NCollapse :expanded-names="expandedNames" @item-header-click="handleClick">
      <NCollapseItem title="生成条件" name="role-search">
        <NForm :model="model" label-placement="left" :label-width="120">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="模块名称(中文注释)" path="moduleName" class="pr-20px">
              <NInput v-model:value="model.moduleName" placeholder="用于注释模块名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="模块名称(英文,模块文件名)" path="fileName" class="pr-20px">
              <NInput v-model:value="model.fileName" placeholder="生成的文件名称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="persistenceKey" path="persistenceKey" class="pr-20px">
              <NInput v-model:value="model.persistenceKey" placeholder="表格key自动转全大写" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="作者(注释用)" path="author" class="pr-20px">
              <NInput v-model:value="model.author" placeholder="用于注释作者" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="邮箱(注释用)" path="email" class="pr-20px">
              <NInput v-model:value="model.email" placeholder="用于注释邮箱" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="列表接口路径" path="tableListApi" class="pr-20px">
              <NInput
                v-model:value="model.tableListApi"
                placeholder="{{myHost}}/business/assess/queryPageInfo.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="新增修改路径" path="tableEditApi" class="pr-20px">
              <NInput
                v-model:value="model.tableEditApi"
                placeholder="{{myHost}}/business/assess/queryPageInfo.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="删除接口路径" path="tableDelApi" class="pr-20px">
              <NInput v-model:value="model.tableDelApi" placeholder="{{myHost}}/business/assess/queryPageInfo.action" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="上下移接口路径" path="tableSortApi" class="pr-20px">
              <NInput
                v-model:value="model.tableSortApi"
                placeholder="{{myHost}}/business/assess/queryPageInfo.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="上下移接口路径" path="tableImportApi" class="pr-20px">
              <NInput
                v-model:value="model.tableImportApi"
                placeholder="{{myHost}}/business/assess/queryPageInfo.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="上下移接口路径" path="tableExportApi" class="pr-20px">
              <NInput
                v-model:value="model.tableExportApi"
                placeholder="{{myHost}}/business/assess/queryPageInfo.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="重置TS类型名字" path="resetTsName" class="pr-20px">
              <NInput v-model:value="model.resetTsName" placeholder="重置生成的ts类型名字" />
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:12" label="生成TS类型数据" path="resetTsName" class="pr-20px">
              <NInput
                v-model:value="model.typeSchema"
                type="textarea"
                round
                class="min-h-154px"
                placeholder="重置生成的ts类型名字"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:12" path="resetTsName" class="pr-20px">
              <template #label>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <span>
                      校正TS类型数据
                      <a rel="noopener noreferrer" target="_blank" href="https://tooltt.com/json2typescript">
                        <NButton type="primary" ghost>点我去复制</NButton>
                      </a>
                    </span>
                  </template>
                  复制 https://tooltt.com/json2typescript 生成的全部内容
                </NTooltip>
              </template>
              <NInput v-model:value="model.typeSchemaCheck" type="textarea" round placeholder="重置生成的ts类型名字" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:12" label="生成表格类型" path="resetTsName" class="pr-20px">
              <NRadioGroup v-model:value="model.tableType" name="top-size">
                <NRadioButton :value="tableTypeMap.DEFAULT">默认</NRadioButton>
                <NRadioButton :value="tableTypeMap.MAIN">Main</NRadioButton>
                <NRadioButton :value="tableTypeMap.SUB">Sub</NRadioButton>
              </NRadioGroup>
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:24" class="pr-20px">
              <NSpace class="w-full" justify="end">
                <NButton type="primary" @click="submit">
                  <template #icon>
                    <icon-carbon-chart-radial class="text-icon" />
                  </template>
                  生成
                </NButton>
                <NButton type="primary" @click="submitAndDownload">
                  <template #icon>
                    <icon-carbon-download class="text-icon" />
                  </template>
                  生成并下载
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
