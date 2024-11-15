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
  const columnsData = generateTsToColumns(formModel);
  const columnsArray: any[] = columnsData.map(({ title, dataIndex }) => {
    return {
      title,
      dataIndex
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
      }
   ]`
    );
  const CODE = `
${getModuleExplain(formModel)}

import { FormColumnsDefine } from 'jd-framework-web/package/components';
import type { ${listData?.tsName} } from './typings';
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
