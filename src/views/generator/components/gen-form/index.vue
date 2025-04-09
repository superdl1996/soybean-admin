<script setup lang="ts">
import { reactive, useTemplateRef, watch } from 'vue';
import { type FormModel, getApiData } from '../shared';
import { mainDetailList, tableTypeMap } from './data';

interface Emits {
  /** 提交 */
  (e: 'submit'): void;
  /** 提交并下载 */
  (e: 'submitAndDownload'): void;
  /** 展开折叠 */
  (e: 'changeCollapse', params?: string[]): void;
}

defineOptions({
  name: 'GenForm'
});

const emit = defineEmits<Emits>();

const model = defineModel<FormModel>('model', { required: true });

const props = withDefaults(
  defineProps<{
    /** 表单数据 */
    expandedNames?: string[];
  }>(),
  { expandedNames: () => ['role-search'] }
);

const commitUrlConfig = reactive({ show: false });
const formRef = useTemplateRef('formRef');

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

watch(
  () => model.value.mainDetailsType,
  nVal => {
    if (nVal !== 'none') {
      commitUrlConfig.show = true;
    } else {
      commitUrlConfig.show = false;
    }
  },
  {
    immediate: true
  }
);

watch(
  () => model.value.tableListApi,
  () => {
    const { listData } = getApiData({ formModel: model.value });
    const commitUrlAry = listData?.apiPath.split('/') || [];
    commitUrlAry.pop();
    model.value.commitUrl = `${commitUrlAry.join('/')}`;
  }
);

/** 移入 */
const mouseenter = () => {
  emit('changeCollapse', ['role-search']);
};

/** 移出 */
const mouseleave = () => {
  emit('changeCollapse', []);
};
const handleClick = () => {
  emit('changeCollapse', !props.expandedNames.length ? ['role-search'] : []);
};

const submit = () => {
  emit('changeCollapse', []);
  emit('submit');
};

const submitAndDownload = () => {
  emit('changeCollapse', []);
  emit('submitAndDownload');
};

defineExpose({
  getFormRef: () => formRef.value
});
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper" @mouseenter.self="mouseenter" @mouseleave="() => {}">
    <NCollapse :expanded-names="expandedNames" @item-header-click="handleClick">
      <NCollapseItem title="生成条件" name="role-search">
        <NForm
          ref="formRef"
          :model="model"
          label-placement="left"
          :label-width="120"
          :rules="{
            commitUrl: {
              required: true,
              message: '流程的commitUrl',
              trigger: 'blur'
            }
          }"
        >
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="模块名称(中文注释)" path="moduleName" class="pr-20px">
              <NInput v-model:value="model.moduleName" placeholder="用于注释模块名" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="模块名称(英文,文件夹名称)" path="fileName" class="pr-20px">
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
            <NFormItemGi span="24 s:12 m:6" label="行编辑路径" path="tableRowEditApi" class="pr-20px">
              <NInput
                v-model:value="model.tableRowEditApi"
                placeholder="{{myHost}}/business/work/bill/content/updateRow.action"
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
            <NFormItemGi span="24 s:12 m:6" label="导入接口路径" path="tableImportApi" class="pr-20px">
              <NInput
                v-model:value="model.tableImportApi"
                placeholder="{{myHost}}/business/assess/queryPageInfo.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="导出接口路径" path="tableExportApi" class="pr-20px">
              <NInput
                v-model:value="model.tableExportApi"
                placeholder="{{myHost}}/business/assess/queryPageInfo.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="是否勇哥版导出" path="tableExportStateApi" class="pr-20px">
              <NCheckbox v-model:checked="model.tableExportStateApi">
                <NTooltip trigger="hover">
                  <template #trigger>取消勾选则使用传入路径</template>
                  勾选此项需要在 src/common/services/system/index.ts 文件夹下创建如下函数:
                  <code>
                    <br />
                    export async function reportExcel(
                    <br />
                    data: FETCH.Req & { /** 后端id */
                    <br />
                    _u?: string;
                    <br />
                    /** 导出名称 */
                    <br />
                    _n?: string;
                    <br />
                    },
                    <br />
                    ) {
                    <br />
                    const { current, exportAll, pageNumber, pageSize, searchParams, ...params } = data;
                    <br />
                    // 1. 将字符串编码为 UTF-8 字节数组
                    <br />
                    const encoder = new TextEncoder();
                    <br />
                    const bytes = encoder.encode(searchParams);
                    <br />
                    // 2. 将字节数组转换为二进制字符串
                    <br />
                    const binaryString = String.fromCharCode(...bytes);
                    <br />
                    const queryString = new URLSearchParams(params).toString();
                    <br />
                    window.open(`/jonda/report/excel?${queryString}&searchParams=${btoa(binaryString)}`);
                    <br />
                    }
                  </code>
                </NTooltip>
              </NCheckbox>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="(启|禁)用接口路径" path="tableStartUseApi" class="pr-20px">
              <NInput
                v-model:value="model.tableStartUseApi"
                placeholder="{{myHost}}/business/config/workbillprocess/updateStatusByIds.action"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="重置TS类型名字" path="resetTsName" class="pr-20px">
              <NInput v-model:value="model.resetTsName" placeholder="重置生成的ts类型名字" />
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:12" label="生成TS类型数据" path="typeSchema" class="pr-20px">
              <NInput
                v-model:value="model.typeSchema"
                type="textarea"
                round
                class="min-h-154px"
                placeholder="重置生成的ts类型名字"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:12" path="typeSchemaCheck" class="pr-20px">
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

            <NFormItemGi span="24 s:6 m:6" label="生成表格类型" path="tableType" class="pr-20px">
              <NRadioGroup v-model:value="model.tableType">
                <NRadioButton :value="tableTypeMap.DEFAULT">默认</NRadioButton>
                <NRadioButton :value="tableTypeMap.MAIN">Main</NRadioButton>
                <NRadioButton :value="tableTypeMap.SUB">Sub</NRadioButton>
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi span="24 s:6 m:6" label="主单据类型" path="mainDetailsType" class="pr-20px">
              <NRadioGroup v-model:value="model.mainDetailsType">
                <NRadioButton v-for="item in mainDetailList" :key="item.type" :value="item.type">
                  {{ item.name }}
                </NRadioButton>
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi
              v-if="commitUrlConfig.show"
              span="24 s:6 m:6"
              label="流程的commitUrl"
              path="commitUrl"
              class="pr-20px"
              :required="true"
            >
              <NInput v-model:value="model.commitUrl" placeholder="例 : /business/visa" />
            </NFormItemGi>

            <NFormItemGi span="24 s:12 m:24" class="pr-20px">
              <NSpace class="w-full" justify="end">
                <NButton type="primary" @click="mouseleave">
                  <template #icon>
                    <icon-carbon-upgrade class="text-icon" />
                  </template>
                  收起
                </NButton>
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
