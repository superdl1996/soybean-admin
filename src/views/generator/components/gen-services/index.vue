<script setup lang="ts">
import { type FormModel, formatEmptyStr, getApiData, getFunctionExplain, getModuleExplain } from '../shared';
import { useCopy } from '../hook';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenServices'
});

const name = 'GenServices';
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const { formModel } = defineProps<Props>();
const code = defineModel<string>('genServices');

const generateCode = () => {
  const { delData, editData, listData, sortData, importData, exportData } = getApiData({ formModel });
  const CODE = `
${getModuleExplain(formModel)}

import { request } from 'umi';
import * as TYPES from './typings';

${getFunctionExplain(formModel, 'tableListApi')}
${formatEmptyStr(
  listData,
  `export async function ${listData?.apiName}(data: FETCH.Req) {
  return request<FETCH.Res<TYPES.${listData?.tsName}>>('${listData?.apiPath}', {
    method: 'POST',
    data,
  });
}`
)}


${getFunctionExplain(formModel, 'tableEditApi')}
${formatEmptyStr(
  editData,
  `export async function ${editData?.apiName}(data: Partial<TYPES.${editData?.tsName}>) {
  return request<FETCH.Res>('${editData?.apiPath}', {
    method: 'POST',
    data,
  });
}`
)}


${getFunctionExplain(formModel, 'tableDelApi')}
${formatEmptyStr(
  delData,
  `export async function ${delData?.apiName}(data: FETCH.UpStatus) {
  return request<FETCH.Res>('${delData?.apiPath}', {
    method: 'POST',
    data,
  });
}`
)}


${getFunctionExplain(formModel, 'tableSortApi')}
${formatEmptyStr(
  sortData,
  `export async function ${sortData?.apiName}(data: { arg1: string; arg2: string }) {
  return request<FETCH.Res>('${sortData?.apiPath}', {
    method: 'POST',
    data,
  });
}`
)}


${getFunctionExplain(formModel, 'tableImportApi')}
${formatEmptyStr(
  importData,
  `export async function ${importData?.apiName}(data: FETCH.Req) {
  return request<FETCH.Res>('/excel/basic/historymat/import.action', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}`
)}


${getFunctionExplain(formModel, 'tableExportApi')}
${formatEmptyStr(
  exportData,
  `export async function ${exportData?.apiName}(data: FETCH.Req) {
  return request<FETCH.Res>('${exportData?.apiPath}', {
    method: 'POST',
    data,
    getResponse: true,
    responseType: 'blob',
  });
}`
)}`;
  code.value = CODE;
};

defineExpose({ name, generateCode, copyCode });
</script>

<template>
  <div>
    <BaseCode ref="baseCodeRef" :n-code="{ code }"></BaseCode>
  </div>
</template>

<style lang="scss" scoped></style>
