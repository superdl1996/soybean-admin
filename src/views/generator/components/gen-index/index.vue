<script setup lang="ts">
import { type FormModel, formatEmptyStr, getApiData, getModuleExplain } from '../shared';
import { useCopy } from '../hook';
import { tableTypeMap } from '../gen-form/data';

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
  const isMain = formModel.tableType === tableTypeMap.MAIN;
  const isSub = formModel.tableType === tableTypeMap.SUB;
  const isSplit = isMain || isSub;

  /** 有主单据类型 */
  const isMainDetails = formModel.mainDetailsType !== 'none';

  const CODE = `
${getModuleExplain(formModel)}

import { ${formatEmptyStr(isMainDetails, `useRef, `)}useState } from 'react';
${formatEmptyStr(!isSplit, "import ViewContainer from 'jd-framework-web/package/components/ViewContainer';")}
import BaseTable from 'jd-framework-web/package/components/BaseTable';
import { BaseTableProps,TableActionType, TableToolbarDefine } from 'jd-framework-web/package/components/BaseTable/typings';
import useAuthButton from 'jd-framework-web/package/utils/auth/useAuthButton';

import * as API from './services';
import * as TYPES from './typings';
import useFormColumns from './useFormColumns';
import useTableColumns from './useTableColumns';
${formatEmptyStr(isMainDetails, `import MainDetails from './MainDetails';`)}


export default (${formatEmptyStr(isMain, `props: TYPES.MainTableProps`)}${formatEmptyStr(isSub, `props: TYPES.SubTableProps`)}) => {
  ${formatEmptyStr(isMain, `const { mainCurrent, setMainCurrent } = props;`)}
  ${formatEmptyStr(
    isSub,
    `const { mainCurrent } = props;
    const {} = mainCurrent ?? {};`
  )}
  const { tableColumns } = useTableColumns();
  const { formColumns } = useFormColumns();
  const { auth: authButton } = useAuthButton();

  ${formatEmptyStr(!isMain && !isSub, `const [${listData?.currentState.join(',')}] = useState<TYPES.${listData?.tsName}>();`)}
  ${formatEmptyStr(isSub, `const [subCurrent, setSubCurrent] = useState<TYPES.${listData?.tsName}>()`)}

  ${formatEmptyStr(
    isMainDetails,
    `
   const tableActionRef = useRef<TableActionType>();
  /** 表格刷新 */
  const tableReload = () => tableActionRef.current?.reload?.();
  /** 主单据弹窗操作 */
  const modalProps = { afterClose: tableReload };`
  )}


  /** 表格操作按钮配置  */
  const toolbar: TableToolbarDefine = {
  ${formatEmptyStr(
    editData,
    `plus: {
      modalTitle: '新增',
      ${formatEmptyStr(
        !isMainDetails,
        `columns: formColumns,
      onSubmit: API.${editData?.apiName},`
      )}
      ${formatEmptyStr(
        isMainDetails,
        `render: <MainDetails operateCurrent={${listData?.currentState[0]}} formType={1} />,
      modalProps,`
      )}

      auth: authButton('plus'),
    },`
  )}
  ${formatEmptyStr(
    editData,
    `edit: {
      modalTitle: '编辑',
      ${formatEmptyStr(
        !isMainDetails,
        `columns: formColumns,
      onSubmit: API.${editData?.apiName},`
      )}
      ${formatEmptyStr(
        isMainDetails,
        `render: <MainDetails operateCurrent={${listData?.currentState[0]}} formType={2} />,
      modalProps,`
      )}
      auth: authButton('edit'),
    },`
  )}
  ${formatEmptyStr(
    editData,
    `details: {
      modalTitle: '查看',
      ${formatEmptyStr(!isMainDetails, `columns: formColumns,`)}
      ${formatEmptyStr(isMainDetails, `render: <MainDetails operateCurrent={${listData?.currentState[0]}} formType={0} />,`)}
      auth: authButton('details'),
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
      onSubmit: API.${exportData?.apiName},
      auth: authButton('export'),
    },`
  )}
  };

  /** 表格配置 */
  const generateTable: BaseTableProps<TYPES.${listData?.tsName}> = {
    persistenceKey: '${listData?.persistenceKey}',
    ${formatEmptyStr(isMainDetails, 'actionRef: tableActionRef,')}
    virtual: false,
    toolbar,
    columns: tableColumns,
    columnsDynamic: true,
    columnDigitNilText: '',
    onActionCurrent: (record) => ${formatEmptyStr(!isMain && !isSub, `${listData?.currentState[1]}(record)`)}${formatEmptyStr(isMain, `setMainCurrent(record)`)}${formatEmptyStr(isSub, `setSubCurrent(record)`)},
    service: {
      dataSourceRequest:API.${listData?.apiName},
    },
  };

  return (
    ${formatEmptyStr(!isSplit, '<ViewContainer>')}
      <BaseTable {...generateTable} />
    ${formatEmptyStr(!isSplit, '</ViewContainer>')}
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
