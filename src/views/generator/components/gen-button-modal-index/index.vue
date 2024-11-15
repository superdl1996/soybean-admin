<script setup lang="ts">
import { type FormModel, getModuleExplain } from '../shared';
import { useCopy } from '../hook';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenButtonModalIndex'
});

const name = 'GenButtonModalIndex';
const { formModel } = defineProps<Props>();
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const code = defineModel<string>('genButtonModalIndex');

const generateCode = () => {
  const CODE = `
${getModuleExplain(formModel)}

import { useRef } from 'react';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import BaseModal from 'jd-framework-web/package/components/BaseModal';
import { BaseModalProps, ModalActionType } from 'jd-framework-web/package/components/BaseModal/typings';

type ButtonModalProps = {
  externalCurrent?: FeeSettingProps['onSelect'];
};

export default (props: ButtonModalProps) => {
  const { externalCurrent } = props;
  const actionRef = useRef<ModalActionType>();
  const title = '设置费率';

  const modalProps: BaseModalProps = {
    title,
    trigger: <Button type="primary"><SwapOutlined />{title}</Button>,
    width: 1200,
    defaultFullScreen: true,
    actionRef: actionRef,
    footer: null,
    noFooter: true,
  };
  return <BaseModal {...modalProps}></BaseModal>;
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
