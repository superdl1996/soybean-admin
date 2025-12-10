<script setup lang="ts">
import { type FormModel, formatEmptyStr, generateTsToColumns, getApiData, getModuleExplain } from '../shared';
import { useCopy } from '../hook';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenUseTableColumns'
});

const name = 'GenUseTableColumns';
const { formModel } = defineProps<Props>();
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const code = defineModel<string>('genUseTableColumns');

/** 判断是否为时间类型 */
const isDateType = (dataIndex: string) => {
  return dataIndex.endsWith('Date') || dataIndex.endsWith('Datetime');
};

const generateCode = () => {
  const { listData, startUseData, rowEditData } = getApiData({ formModel });
  const columnsData = generateTsToColumns(formModel);

  /** 是否为流程主单据类型 */
  const isFlow = formModel.mainDetailsType === 'flow';

  /** 添加时间筛选 */
  const addColumnsData: any[] = [];
  const columnsArray: any[] = columnsData.map(item => {
    const { title, dataIndex } = item;
    let dictItem =
      title.includes('元') ||
      title.includes('额') ||
      title.includes('费') ||
      title.includes('价') ||
      title.endsWith('量')
        ? { valueType: 'digit' }
        : {};

    if (isDateType(dataIndex)) {
      dictItem = { valueType: 'date' };
      addColumnsData.push({
        title,
        dataIndex,
        valueType: 'dateRange',
        hideInTable: true
      });
    }

    const genWidthItem = () => {
      const widthItem = { width: 120 };
      const widthMap = new Map([
        [['名称', '特征'], 240],
        [['计量单位', '类型'], 80]
      ]);

      for (const [keys, width] of widthMap) {
        for (const key of keys) {
          if (title.includes(key)) {
            widthItem.width = width;
          }
        }
      }
      if (title === '单位') widthItem.width = 80;
      if (isDateType(dataIndex)) widthItem.width = 100;
      return widthItem;
    };

    type Align = 'center' | 'right';
    const genAlignItem = () => {
      const alignItem: { align?: Align } = {};
      const alignMap = new Map([[['计量单位', '类型'], 'center']]);

      for (const [keys, align] of alignMap) {
        for (const key of keys) {
          if (title.includes(key)) {
            alignItem.align = align as Align;
          }
        }
      }

      if (title === '单位') alignItem.align = 'center';

      return alignItem;
    };

    const rowConfig = rowEditData ? { cellEdit: true } : {};

    return {
      title,
      dataIndex,
      ...dictItem,
      search: false,
      ...genWidthItem(),
      ...genAlignItem(),
      ...rowConfig
    };
  });

  addColumnsData.forEach(item => {
    for (const [index, columnsItem] of columnsArray.entries()) {
      if (item.title === columnsItem.title) {
        columnsArray.splice(index + 1, 0, { ...item });
        return;
      }
    }
  });

  columnsArray.unshift({
    dataIndex: 'index',
    width: 60
  });

  const reg = /(},|\[)/g;
  let columnsJson = JSON.stringify(columnsArray)
    .replace(reg, '$1\n      ')
    .replace(
      ']',
      `,
      /** 参考属性,不需要可删除 */
      {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        valueType: 'select',
        customFieldProps: { options: dicts?.INDUSTRY }
      },
      ${formatEmptyStr(
        startUseData,
        `/** 启用禁用 */
        {
        width: 60,
        title: '状态',
        dataIndex: 'billStatus',
        valueType: 'select',
        valueEnum: ENUMBILLSTATUS,
        customRender: (_, { billStatus }) => <StatusText status={billStatus} />,
        customFieldProps: { showSearch: true },
      },
      `
      )}
   ]`
    );

  if (isFlow) {
    columnsJson = columnsJson.replace(
      '{"dataIndex":"index","width":60},',
      `
    {"dataIndex":"index","width":60},
    {
      title: '操作',
      width: 70,
      align: 'center',
      search: false,
      dataIndex: 'action',
      customRender: (_, { processInstanceId, processDefinitionId }) => (
        <Space>
          <ProcessChart
            button="icon"
            processInstanceId={processInstanceId}
            processDefinitionId={processDefinitionId}
          />
          <ProcessHistoryTable button="icon" processInstanceId={processInstanceId} />
        </Space>
      ),
    },
    {
      title: '审批状态',
      dataIndex: 'billStatus',
      valueType: 'radioButton',
      valueEnum: ENUMPROCESSSTATUS,
      customRender: (_, { billStatus, workflowLockStatus, returnStatus }) => (
        <ProcessStatus
          status={billStatus}
          workflowLockStatus={workflowLockStatus}
          returnStatus={returnStatus}
        />
      ),
      renderFormItem: ({ valueEnum }) => <RadioGroupButton valueEnum={valueEnum} />,
      align: 'center',
    },`
    );
  }
  const CODE = `
${getModuleExplain(formModel)}

${formatEmptyStr(
  isFlow,
  `
import { Space } from 'antd';
import ProcessChart from 'jd-framework-web/package/common/process/ProcessChart';
import ProcessHistoryTable from 'jd-framework-web/package/common/process/ProcessHistoryTable';
import { ENUMPROCESSSTATUS } from '@/common/constant/valueEnum';
import ProcessStatus from 'jd-framework-web/package/common/textTag/ProcessStatus';
import RadioGroupButton from 'jd-framework-web/package/components/RadioGroupButton';
`
)}
import { TableColumnsDefine } from 'jd-framework-web/package/components';
${formatEmptyStr(
  startUseData,
  `import { ENUMBILLSTATUS } from '@/common/constant/valueEnum';
import StatusText from 'jd-framework-web/package/common/textTag/StatusText';
`
)}
import { useDicts } from '@/common/hooks/useDicts';
import type { ${listData?.tsName} } from './typings';

export default () => {
  const { dicts } = useDicts(['INDUSTRY']);

  const tableColumns: TableColumnsDefine<${listData?.tsName}> = ${columnsJson}

  return { tableColumns };
}
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
