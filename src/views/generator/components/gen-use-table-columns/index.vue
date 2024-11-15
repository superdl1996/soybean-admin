<script setup lang="ts">
import { type FormModel, generateTsToColumns, getApiData, getModuleExplain } from '../shared';
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

const generateCode = () => {
  const { listData } = getApiData({ formModel });
  const columnsData = generateTsToColumns(formModel);
  /** 添加时间筛选 */
  const addColumnsData: any[] = [];
  const columnsArray: any[] = columnsData.map(({ title, dataIndex }) => {
    if (dataIndex.endsWith('Date') || dataIndex.endsWith('Datetime')) {
      addColumnsData.push({
        title,
        dataIndex,
        valueType: 'dateRange',
        hideInTable: true
      });
    }
    const dictItem =
      title.includes('元') ||
      title.includes('额') ||
      title.includes('费') ||
      title.includes('价') ||
      title.endsWith('量')
        ? { valueType: 'digit' }
        : {};
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
      return widthItem;
    };

    type Align = 'center' | 'right';
    const genAlignItem = () => {
      const alignItem: { align?: Align } = {};
      const alignMap = new Map([[['编码', '计量单位', '类型'], 'center']]);

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

    return {
      title,
      dataIndex,
      ...dictItem,
      search: false,
      ...genWidthItem(),
      ...genAlignItem()
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
  const columnsJson = JSON.stringify(columnsArray)
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
      }
   ]`
    );
  const CODE = `
${getModuleExplain(formModel)}

import { TableColumnsDefine } from 'jd-framework-web/package/components';
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
