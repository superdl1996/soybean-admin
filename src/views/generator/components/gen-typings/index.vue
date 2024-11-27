<script setup lang="ts">
import { type FormModel, checkTsData, formatEmptyStr, getApiData, getModuleExplain } from '../shared';
import { useCopy } from '../hook';
import { tableTypeMap } from '../gen-form/data';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenTypings'
});

const name = 'GenTypings';
const { formModel } = defineProps<Props>();
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const code = defineModel<string>('genTypings');

const generateTs = (tsName?: string) => {
  const { listData } = getApiData({ formModel });
  const isMain = formModel.tableType === tableTypeMap.MAIN;
  const isSub = formModel.tableType === tableTypeMap.SUB;
  const textArray = checkTsData(formModel);
  let text = '';
  textArray.forEach((type, index) => {
    if (['boolean', 'string', 'number'].includes(type)) {
      const key = textArray[index - 1];
      const explain = textArray[index + 1];
      text += `    ${explain ? `/** ${explain}  */\n  ` : ''}${key}: ${type};\n`;
    }
  });
  text = `
  ${formatEmptyStr(
    isMain,
    `/** 主表props */
export type MainTableProps = {
  /** 主表当前操作行数据 */
  mainCurrent: MainTableListItem | undefined;
  /** 主表操作方法 */
  setMainCurrent: (params?: MainTableListItem) => void;
};`
  )}

${formatEmptyStr(isSub, `import { MainTableListItem } from '../MainTable/typings';`)}

${formatEmptyStr(
  isSub,
  `/** 副表props */
export type SubTableProps = {
  mainCurrent: MainTableListItem | undefined;
};`
)}

  /** ${formModel.moduleName} */
  export type ${tsName || listData?.tsName} = {\n${text}}`;

  return text;
};

const generateCode = () => {
  const CODE = `
${getModuleExplain(formModel)}

${generateTs()}
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
