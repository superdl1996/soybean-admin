<script setup lang="tsx">
import { nextTick, reactive, ref, useTemplateRef } from 'vue';
import { request } from '@/service/request';
import GenForm from './components/gen-form/index.vue';
import GenIndex from './components/gen-index/index.vue';
import GenServices from './components/gen-services/index.vue';
import GenTypings from './components/gen-typings/index.vue';
import GenUseFormColumns from './components/gen-use-form-columns/index.vue';
import GenUseTableColumns from './components/gen-use-table-columns/index.vue';
import GenSplitIndex from './components/gen-split-index/index.vue';
import GenButtonModalIndex from './components/gen-button-modal-index/index.vue';
import type { FormModel, GenerateAction } from './components/shared';
import { tableTypeMap } from './components/gen-form/data';

const moduleList = [
  {
    name: 'GenIndex',
    tab: 'index.tsx',
    modelKey: 'gen-index',
    component: GenIndex
  },
  {
    name: 'GenServices',
    tab: 'services.ts',
    modelKey: 'gen-services',
    component: GenServices
  },
  {
    name: 'GenTypings',
    tab: 'typings.d.ts',
    modelKey: 'gen-typings',
    component: GenTypings
  },
  {
    name: 'GenUseFormColumns',
    tab: 'useFormColumns.tsx',
    modelKey: 'gen-use-form-columns',
    component: GenUseFormColumns
  },
  {
    name: 'GenUseTableColumns',
    tab: 'useTableColumns.tsx',
    modelKey: 'gen-use-table-columns',
    component: GenUseTableColumns
  },
  {
    name: 'GenSplitIndex',
    tab: 'Split.index.tsx',
    modelKey: 'gen-split-index',
    component: GenSplitIndex
  },
  {
    name: 'GenButtonModalIndex',
    tab: 'ButtonModal.index.tsx',
    modelKey: 'gen-button-modal-index',
    component: GenButtonModalIndex
  }
];

const codeModel = reactive<Record<string, string>>({});
const tabActiveName = ref('GenIndex');
const moduleRefs = useTemplateRef<GenerateAction[]>('moduleRefs');

const typeSchema = `productionDeptCode	string	项目主管单位编码
productionDeptName	string	项目主管单位
projectCode	string	工程编号
projectName	string	工程名称
projectType	string	工程类型
listId	string	无
completeDate	string	审定日期`;

const searchParams = reactive<FormModel>({
  moduleName: '汇总表',
  fileName: 'DefaultTable',
  persistenceKey: '',
  email: '2470381299@qq.com',
  author: 'DL',
  tableListApi: '{{dev}}/business/controlprice/origin/sum/queryPageInfo.action',
  tableEditApi: '',
  tableDelApi: '',
  tableSortApi: '',
  tableImportApi: '',
  tableExportApi: '',
  resetTsName: '',
  typeSchema,
  typeSchemaCheck: '',
  tableType: tableTypeMap.DEFAULT
});

const requestGenerate = () => {
  request({
    url: 'http://localhost:3000/generate',
    method: 'post',
    responseType: 'blob',
    data: { codeModel, fileName: searchParams.fileName }
  }).then(res => {
    const { response } = res;
    const { data, headers } = response;
    const filename = headers['content-disposition'].split('filename=')[1];

    if (!data) return;
    const blob = new Blob([data as unknown as Blob], { type: 'application/zip' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
  });
};

const submit = () => {
  if (!moduleRefs.value) return;
  for (const item of moduleRefs.value) {
    item?.generateCode();
    if (item?.name === tabActiveName.value) {
      nextTick(() => {
        item.copyCode();
      });
    }
  }
};

const submitAndDownload = async () => {
  submit();
  await nextTick();
  requestGenerate();
};

const updateValue = (value: string) => {
  tabActiveName.value = value;
  if (!moduleRefs?.value) return;
  for (const item of moduleRefs.value) {
    if (item?.name === value) {
      item?.copyCode?.();
      return;
    }
  }
};
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <GenForm v-model:model="searchParams" @submit="submit" @submit-and-download="submitAndDownload" />
    <NCard title="" :bordered="false" size="small" content-class="h-100%" class="h-100% overflow-y-hidden card-wrapper">
      <NTabs class="h-100%" pane-wrapper-class="h-100%" type="line" animated @update-value="updateValue">
        <NTabPane
          v-for="item in moduleList"
          :key="item.name"
          class="h-100%"
          :name="item.name"
          :tab="item.tab"
          display-directive="show"
        >
          <component
            :is="item.component"
            ref="moduleRefs"
            v-model:[item.modelKey]="codeModel[item.name]"
            class="h-100%"
            :form-model="searchParams"
          ></component>
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped></style>
