<script setup lang="ts">
import { type FormModel, getModuleExplain } from '../shared';
import { useCopy } from '../hook';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenSplitIndex'
});

const name = 'GenSplitIndex';
const { formModel } = defineProps<Props>();
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const code = defineModel<string>('genSplitIndex');

const generateCode = () => {
  // const { delData, editData, listData, sortData, importData, exportData } = getApiData({ formModel });

  const CODE = `
${getModuleExplain(formModel)}

import { useState } from 'react';
import ViewContainer from 'jd-framework-web/package/components/ViewContainer';
import SplitPane, { PaneContainer } from 'jd-framework-web/package/components/SplitPane';
import MainTable from './MainTable';
import { MainTableListItem } from './MainTable/typings';
import SubTable from './SubTable';

export default () => {
  const [mainCurrent, setMainCurrent] = useState<MainTableListItem>();
  return (
    <ViewContainer>
      <SplitPane>
        <PaneContainer width={550}>
          <MainTable setMainCurrent={setMainCurrent} mainCurrent={mainCurrent} />
        </PaneContainer>
        <PaneContainer flex>
          <SubTable mainCurrent={mainCurrent} />
        </PaneContainer>
      </SplitPane>
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
