<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

interface FormModelProps {
  status: number;
  template: string;
}

const { copy } = useClipboard();

const statusOptions = ref([
  {
    label: 'Button标签',
    value: 0,
    template: `<Button className={className}></Button>`
  },
  {
    label: 'className',
    value: 1,
    template: `{className}`
  },
  {
    label: 'className="xx"',
    value: 2,
    template: `className={className}`
  }
]);

const formModel = ref<FormModelProps>({
  status: 0,
  template: statusOptions.value[0].template
});

const computedTemplate = computed((): string => statusOptions.value[formModel.value.status].template);

watch(
  () => formModel.value.status,
  () => {
    formModel.value.template = computedTemplate.value;
  }
);

const copyCode = async ({ type, value }: { type: string; value: string }) => {
  const reg = /\{([\w]+)\}/;

  const formatTemplate = formModel.value.template.replace(reg, `${value}`);
  let templateStr = formModel.value.template.replace(reg, `"${value}"`);
  templateStr = formatTemplate === value ? value : `${templateStr}`;
  const copyVal = type === 'template' ? `${templateStr}` : value;

  await copy(copyVal);
  window.$message?.success(`复制 ${copyVal} 成功`);
};

const buttonPrimaryList = [
  { text: false, class: 'ButtonPrimary' },
  { text: false, class: 'ant-btn-primary' },
  { text: false, class: 'PlusButton' },
  { text: false, class: 'EditButton' },
  { text: false, class: 'DetailsButton' },
  { text: false, class: 'ButtonGeekBlue' },
  { text: false, class: 'ButtonBlue' },
  { text: false, class: 'ButtonCyan' },
  { text: false, class: 'ButtonGreen' },
  { text: false, class: 'ButtonLime' },
  { text: false, class: 'ButtonYellow' },
  { text: false, class: 'ButtonGold' },
  { text: false, class: 'ButtonVolcano' },
  { text: false, class: 'ButtonRed' },
  { text: false, class: 'ButtonPurple' },
  { text: false, class: 'ButtonMagenta' }
];

const buttonHollowHoverList = [
  { text: false, class: 'EnableButton' },
  { text: false, class: 'DisableButton' },
  { text: false, class: 'ImportButton' },
  { text: false, class: 'ExpandButton' },
  { text: false, class: 'FoldButton' },
  { text: false, class: 'MoveTopButton' },
  { text: false, class: 'MoveDownButton' },
  { text: false, class: 'ant-btn-dangerous' },
  { text: false, class: 'BorderButtonGeekBlue' },
  { text: false, class: 'BorderButtonBlue' },
  { text: false, class: 'BorderButtonCyan' },
  { text: false, class: 'BorderButtonGreen' },
  { text: false, class: 'BorderButtonLime' },
  { text: false, class: 'BorderButtonYellow' },
  { text: false, class: 'BorderButtonGold' },
  { text: false, class: 'BorderButtonOrange' },
  { text: false, class: 'BorderButtonVolcano' },
  { text: false, class: 'BorderButtonRed' },
  { text: false, class: 'BorderButtonPurple' },
  { text: false, class: 'BorderButtonMagenta' }
];

const buttonLinkList = [
  { text: true, class: 'linkAButton' },
  { text: true, class: 'linkAButtonDanger' },
  { text: true, class: 'LinkButtonCopy' },
  { text: true, class: 'LinkButtonCut' },
  { text: true, class: 'LinkButtonPast' },
  { text: true, class: 'EditButtonLink' },
  { text: true, class: 'PlusButtonLink' },
  { text: true, class: 'DetailsButtonLink' },
  { text: true, class: 'EnableButtonLink' },
  { text: true, class: 'DisableButtonLink' }
];

const buttonList = [
  {
    name: '实心按钮',
    list: buttonPrimaryList
  },
  {
    name: '空心按钮',
    list: buttonHollowHoverList
  },
  {
    name: 'Link按钮',
    list: buttonLinkList
  }
];
</script>

<template>
  <div class="btn-wap">
    <NCard style="margin-bottom: 10px">
      <NForm ref="formRef" label-placement="left" inline :label-width="80" :model="formModel">
        <NFormItem label="模板类型" path="status">
          <NSelect v-model:value="formModel.status" style="width: 160px" :options="statusOptions" />
        </NFormItem>
        <NFormItem label="复制模板" path="template">
          <NInput
            v-model:value="formModel.template"
            style="width: 380px"
            placeholder="请输入模板,会将 {className} 转为要复制的className"
          />
        </NFormItem>
        <NFormItem>
          <NTag type="primary">
            <template #icon>
              <icon-carbon-ai-status-in-progress></icon-carbon-ai-status-in-progress>
            </template>
            用于点击复制, 模板的
            <b>&nbsp;{className}&nbsp;</b>
            会被替换
          </NTag>
        </NFormItem>
      </NForm>
    </NCard>
    <NGrid :x-gap="12" :y-gap="8" :cols="1">
      <NGridItem v-for="(item, index) in buttonList" :key="index">
        <NCard :title="item.name">
          <NSpace>
            <NButton
              v-for="(itemChild, indexChild) in item.list"
              :key="indexChild"
              trigger="hover"
              :text="itemChild?.text"
              :class="itemChild.class"
              @click="copyCode({ type: 'template', value: itemChild.class })"
            >
              按钮
            </NButton>
          </NSpace>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style lang="less" scoped>
@isPure: 'true';
@primary5: #1b63ab;
@primary6: #00489d;
@primary7: #003478;

.btn-wap {
  // @focusColor: 聚焦颜色  @isPure: 是否为实心按钮 @textColor:字体颜色
  .hover-focus-styles(@focusColor, @isCurrentPure: 'false', @textColor:#fff) {
    &:focus {
      color: @focusColor !important;
      border-color: @focusColor !important;
      & when(@isCurrentPure = @isPure) {
        color: @textColor !important;
        background: @focusColor !important;
      }
    }
    &:hover {
      color: @textColor !important;
      background: @focusColor !important;
      border-color: @focusColor !important;
    }
  }

  .ant-btn-primary {
    color: #fff;
    border-color: @primary6;
    background: @primary6;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }

  .ant-btn-dangerous {
    color: #d15b47;
    background: #fff;
    .hover-focus-styles(#d15b47);
    &:focus {
      background: #fff !important;
    }
  }

  @PlusButtonColor: @primary6;
  @PlusButtonColorHover: rgba(@primary6, 0.8);
  .PlusButton {
    color: #fff;
    background: @PlusButtonColor;
    border-color: @PlusButtonColor;
    .hover-focus-styles(@PlusButtonColorHover,@isPure);
  }
  .PlusButtonLink {
    color: @PlusButtonColor;
    &:hover,
    &:focus {
      color: @PlusButtonColorHover;
    }
  }

  @EditButtonColor: @primary5;
  @EditButtonColorHover: rgba(@primary5, 0.8);
  .EditButton {
    color: #fff;
    background: @EditButtonColor;
    border-color: @EditButtonColor;
    .hover-focus-styles(@EditButtonColorHover,@isPure);
  }
  .EditButtonLink {
    color: @EditButtonColor;
    &:hover,
    &:focus {
      color: @EditButtonColorHover;
    }
  }

  @DetailsButtonColor: @primary6;
  @DetailsButtonColorHover: @primary5;
  .DetailsButton {
    color: #fff;
    background: @DetailsButtonColor;
    border-color: @DetailsButtonColor;
    .hover-focus-styles(@DetailsButtonColorHover,@isPure);
  }
  .DetailsButtonLink {
    color: @DetailsButtonColor;
    &:hover,
    &:focus {
      color: @DetailsButtonColorHover;
    }
  }

  @EnableButtonColor: #08979c;
  @EnableButtonColorHover: #08979c;
  .EnableButton {
    color: #fff;
    color: @EnableButtonColor;
    border-color: @EnableButtonColor;
    .hover-focus-styles(@EnableButtonColorHover,@isPure);
  }
  .EnableButtonLink {
    color: @EnableButtonColor;
    &:hover,
    &:focus {
      color: @EnableButtonColorHover;
    }
  }

  @DisableButtonColor: #d48806;
  @DisableButtonColorHover: #d48806;
  .DisableButton {
    color: #fff;
    color: @DisableButtonColor;
    border-color: @DisableButtonColor;
    .hover-focus-styles(@DisableButtonColorHover);
  }

  .DisableButtonLink {
    color: @DisableButtonColor;
    &:hover,
    &:focus {
      color: @DisableButtonColorHover;
    }
  }

  .ImportButton {
    color: @primary7 !important;
    border-color: @primary7;
    .hover-focus-styles(@primary6);
  }

  .ExportButton {
    color: @primary6 !important;
    border-color: @primary6 !important;
    .hover-focus-styles(@primary5);
  }

  .ExpandButton {
    color: #1890ff !important;
    border-color: #1890ff !important;
    &:hover,
    &:focus {
      color: #fff;
      background: rgba(#1890ff, 0.1) !important;
    }
  }

  .FoldButton {
    color: #13c2c2 !important;
    border-color: #13c2c2 !important;
    &:hover,
    &:focus {
      color: #fff;
      background: rgba(#13c2c2, 0.1) !important;
    }
  }

  .MoveTopButton {
    color: #a0d911 !important;
    border-color: #a0d911 !important;
    &:hover,
    &:focus {
      color: #fff;
      background: rgba(#a0d911, 0.1) !important;
    }
  }

  .MoveDownButton {
    color: #52c41a !important;
    border-color: #52c41a !important;
    &:hover,
    &:focus {
      color: #fff;
      background: rgba(#52c41a, 0.1) !important;
    }
  }

  /** 纯色按钮 */
  .ButtonPrimary {
    color: #fff;
    background: @primary6;
    border-color: @primary6;
    .hover-focus-styles(@primary5,@isPure);
  }

  .ButtonGeekBlue {
    color: #fff;
    background: #2f54eb;
    border-color: #2f54eb;
    .hover-focus-styles(#597ef7,@isPure);
  }

  .ButtonBlue {
    color: #fff;
    background: #096dd9;
    border-color: #096dd9;
    .hover-focus-styles(#1890ff,@isPure);
  }

  .ButtonCyan {
    color: #fff;
    background: #006d75;
    border-color: #006d75;
    .hover-focus-styles(#08979c,@isPure);
  }

  .ButtonGreen {
    color: #fff;
    background: #135200;
    border-color: #135200;
    .hover-focus-styles(#237804,@isPure);
  }

  .ButtonLime {
    color: #fff;
    background: #5b8c00;
    border-color: #5b8c00;
    .hover-focus-styles(#7cb305,@isPure);
  }

  .ButtonYellow {
    color: #fff;
    background: #fadb14;
    border-color: #fadb14;
    .hover-focus-styles(#ffec3d,@isPure);
  }

  .ButtonGold {
    color: #fff;
    background: #d48806;
    border-color: #d48806;
    .hover-focus-styles(#faad14,@isPure);
  }

  .ButtonOrange {
    color: #fff;
    background: #d46b08;
    border-color: #d46b08;
    .hover-focus-styles(#ffa940,@isPure);
  }

  .ButtonVolcano {
    color: #fff;
    background: #fa541c;
    border-color: #fa541c;
    .hover-focus-styles(#ff7a45,@isPure);
  }

  .ButtonRed {
    color: #fff;
    background: #d15b47;
    border-color: #d15b47;
    .hover-focus-styles(#e4634c,@isPure);
  }

  .ButtonPurple {
    color: #fff;
    background: #722ed1;
    border-color: #722ed1;
    .hover-focus-styles(#9254de,@isPure);
  }

  .ButtonMagenta {
    color: #fff;
    background: #eb2f96;
    border-color: #eb2f96;
    .hover-focus-styles(#f759ab,@isPure);
  }

  /** 只有边框色的按钮 */
  .BorderButtonPrimary {
    color: @primary6;
    border-color: @primary6;
  }

  .BorderButtonGeekBlue {
    color: #2f54eb;
    border-color: #2f54eb;
    .hover-focus-styles(rgba(#2f54eb, 0.8));
  }

  .BorderButtonBlue {
    color: #096dd9;
    border-color: #096dd9;
    .hover-focus-styles(rgba(#096dd9, 0.8));
  }

  .BorderButtonCyan {
    color: #006d75;
    border-color: #006d75;
    .hover-focus-styles(rgba(#006d75, 0.8));
  }

  .BorderButtonGreen {
    color: #135200;
    border-color: #135200;
    .hover-focus-styles(rgba(#135200, 0.8));
  }

  .BorderButtonLime {
    color: #5b8c00;
    border-color: #5b8c00;
    .hover-focus-styles(rgba(#5b8c00, 0.8));
  }

  .BorderButtonYellow {
    color: #fadb14;
    border-color: #fadb14;
    .hover-focus-styles(rgba(#fadb14, 0.8));
  }

  .BorderButtonGold {
    color: #d48806;
    border-color: #d48806;
    .hover-focus-styles(rgba(#d48806, 0.8));
  }

  .BorderButtonOrange {
    color: #d46b08;
    border-color: #d46b08;
    .hover-focus-styles(rgba(#d46b08, 0.8));
  }

  .BorderButtonVolcano {
    color: #fa541c;
    border-color: #fa541c;
    .hover-focus-styles(rgba(#fa541c, 0.8));
  }

  .BorderButtonRed {
    color: #d15b47;
    border-color: #d15b47;
    .hover-focus-styles(rgba(#d15b47, 0.8));
  }

  .BorderButtonPurple {
    color: #722ed1;
    border-color: #722ed1;
    .hover-focus-styles(rgba(#722ed1, 0.8));
  }

  .BorderButtonMagenta {
    color: #eb2f96;
    border-color: #eb2f96;
    .hover-focus-styles(rgba(#eb2f96, 0.8));
  }

  .linkAButton {
    color: @primary5;
    cursor: pointer;
    &:hover,
    &:focus {
      color: @primary6;
    }
  }

  .linkAButtonDanger {
    color: #434343;
    cursor: pointer;
    &:hover,
    &:focus {
      color: #ea3c3f !important;
    }
  }

  .gap-wrapper {
    margin: 0 -4px;
    color: #8c8c8c;
  }

  .LinkButtonCopy {
    color: #722ed1;
  }

  .LinkButtonCut {
    color: #d48806;
  }

  .LinkButtonPast {
    color: #08979c;
  }
}
</style>
