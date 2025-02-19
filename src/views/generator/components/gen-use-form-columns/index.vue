<script setup lang="ts">
import { type FormModel, generateTsToColumns, getApiData, getModuleExplain } from '../shared';
import { useCopy } from '../hook';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenUseFormColumns'
});

const name = 'GenUseFormColumns';
const { formModel } = defineProps<Props>();
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const code = defineModel<string>('genUseFormColumns');

const generateCode = () => {
  const { listData } = getApiData({ formModel });
  /** 有主单据类型 */
  const isMainDetails = formModel.mainDetailsType !== 'none';
  const columnsData = generateTsToColumns(formModel);
  const columnsArray: any[] = columnsData.map(({ title, dataIndex }) => {
    const otherColumn: { [k: string]: any } = {};
    if (title.includes('金额') || title.includes('价') || title.includes('量')) {
      otherColumn.valueType = 'digit';
    }
    return {
      title,
      dataIndex,
      ...otherColumn
    };
  });
  columnsArray.unshift({
    dataIndex: 'id',
    hideInForm: true
  });
  columnsArray.push();

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
        valueType: 'select',
        formItemProps: { rules: VERIFICATION.required },
        customFieldProps: { options: dicts?.INDUSTRY }
      },
      /** textarea 跨行跨列配置,参考属性,不需要可删除 */
      {
        title: 'textarea跨行跨列',
        dataIndex: 'annotations',
        valueType: 'textarea',
        colProps: { span: 24 },
        formItemProps: {
          labelCol: {
            span: 2,
          },
          wrapperCol: {
            span: 22,
          },
        },
        customFieldProps: {
          autoSize: { minRows: 2 },
        },
      },
   ]`
    );
  const CODE = `
${getModuleExplain(formModel)}

import { FormColumnsDefine } from 'jd-framework-web/package/components';

import type { ${listData?.tsName} } from '${isMainDetails ? '..' : '.'}/typings';
import VERIFICATION from '@/common/constant/verification';
import { useDicts } from '@/common/hooks/useDicts';

export default () => {
  const { dicts } = useDicts(['INDUSTRY']);

  const formColumns: FormColumnsDefine<${listData?.tsName}> = ${columnsJson}

  return { formColumns };
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
