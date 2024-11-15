<script setup lang="ts">
import { type FormModel, formatEmptyStr, getApiData, getModuleExplain } from '../shared';
import { useCopy } from '../hook';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenIndex'
});

const name = 'GenIndex';
const { formModel } = defineProps<Props>();
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const code = defineModel<string>('genIndex');

const generateCode = () => {
  const { delData, editData, listData, sortData, importData, exportData } = getApiData({ formModel });

  const CODE = `
${getModuleExplain(formModel)}

import { useState } from 'react';
import ViewContainer from 'jd-framework-web/package/components/ViewContainer';
import BaseTable from 'jd-framework-web/package/components/BaseTable';
import { BaseTableProps, TableToolbarDefine } from 'jd-framework-web/package/components/BaseTable/typings';
import useAuthButton from 'jd-framework-web/package/utils/auth/useAuthButton';

import * as API from './services';
import * as TYPES from './typings';
import useFormColumns from './useFormColumns';
import useTableColumns from './useTableColumns';

export default () => {
  const { tableColumns } = useTableColumns();
  const { formColumns } = useFormColumns();
  const { auth: authButton } = useAuthButton();

  const [${listData?.currentState.join(',')}] = useState<TYPES.${listData?.tsName}>();

  /** 表格操作按钮配置  */
  const toolbar: TableToolbarDefine = {
  ${formatEmptyStr(
    editData,
    `plus: {
      modalTitle: '新增',
      columns: formColumns,
      onSubmit: API.${editData?.apiName},
      auth: authButton('plus'),
    },`
  )}
  ${formatEmptyStr(
    editData,
    `edit: {
      modalTitle: '编辑',
      columns: formColumns,
      onSubmit: API.${editData?.apiName},
      auth: authButton('edit'),
    },`
  )}
  ${formatEmptyStr(delData, `deleted: { onSubmit: API.${delData?.apiName}, auth: authButton('deleted') },`)}
  ${formatEmptyStr(sortData, `sort: { onSubmit: API.${sortData?.apiName}, auth: authButton('sort') },`)}
  ${formatEmptyStr(
    importData,
    `import: {
      onSubmit: API.${importData?.apiName},
      auth: authButton('import'),
    },`
  )}
  ${formatEmptyStr(
    exportData,
    `export: {
      exportType: 'default',
      onSubmit: API.${exportData?.apiName},
      auth: authButton('export'),
    },`
  )}
  };

  /** 表格配置 */
  const generateTable: BaseTableProps<TYPES.${listData?.tsName}> = {
    persistenceKey: '${listData?.persistenceKey}',
    virtual: false,
    toolbar,
    columns: tableColumns,
    columnsDynamic: true,
    columnDigitNilText: '',
    onActionCurrent: (record) => ${listData?.currentState[1]}(record),
    service: {
      dataSourceRequest:API.${listData?.apiName},
    },
  };

  return (
    <ViewContainer>
      <BaseTable {...generateTable} />
    </ViewContainer>
  );
};
`;

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
