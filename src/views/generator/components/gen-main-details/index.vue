<script setup lang="ts">
import { type FormModel, getApiData, getModuleExplain } from '../shared';
import { useCopy } from '../hook';

interface Props {
  formModel: FormModel;
}

defineOptions({
  name: 'GenMainDetails'
});

const name = 'GenUseTableColumns';
const { formModel } = defineProps<Props>();
const { copyCode } = useCopy({ templateName: 'baseCodeRef' });
const code = defineModel<string>('genMainDetails');

/** 获取流程主单据代码 */
const getFlowCode = () => {
  const { listData, editData } = getApiData({ formModel });

  return `
  import { useRef, useState } from 'react';
  import { ProFormInstance } from '@ant-design/pro-form';

  import { businessQueryOne } from '@/common/process/ProcessMainForm/services';
  import { BaseSchemaFormProps } from 'jd-framework-web/package/components';
  import { ProcessBusinessProps } from 'jd-framework-web/package/common/process/ProcessBusiness/typings';
  import ProcessBusiness from 'jd-framework-web/package/common/process/ProcessBusiness';
  import SpaceView from 'jd-framework-web/package/components/ViewContainer/SpaceView';
  import BaseCard from 'jd-framework-web/package/components/BaseCard';
  import BaseSchemaForm from 'jd-framework-web/package/components/BaseSchemaForm';
  import AnnexTable from 'jd-framework-web/package/common/annex/AnnexTable';
  import { LAYOUTCOL } from '@/common/constant/layoutCol';


  import useMainFormColumns from './useMainFormColumns';
  import * as TYPES from '../typings';
  import * as API from '../services';

  type MainDetailsProps = {
    /** 系统表单类型 0 readonly 详情 1 添加 2 编辑  */
    formType: SYS.FormType;
    operateCurrent?: TYPES.${listData?.tsName};
  };

  /** 表单通用配置 */
  const schemaFormConfig = {
    ...LAYOUTCOL.defaultLayout,
    labelCol: { style: { width: 140 } },
    wrapperCol: { span: 'auto', style: { marginRight: 24 } },
    submitter: false,
    grid: true,
  };

  /** 主单据详情 */
  export default (props: MainDetailsProps) => {
    const { formType: formTypeProp } = props;

    /** 流程前缀 */
    const commitUrl = '${formModel.commitUrl}';
    /** 非新增取当前行 */
    const formCurrent = props.formType === 1 ? undefined : props.operateCurrent;
    const { formColumns } = useMainFormColumns();

    /** 已完成单据不可编辑只可查看 */
    const formType = formTypeProp === 2 ? (formCurrent?.billStatus == '2' ? 0 : 2) : formTypeProp;

    /** 当前问题及反馈单据 */
    const [operateCurrent, setOperateCurrent] = useState<TYPES.${listData?.tsName} | undefined>(formCurrent);

    /** 当前是否有流程保存权限 根据流程查询权限 */
    const [processAuth, setProcessAuth] = useState<boolean>(formType !== 0);

    /** 业务单据信息 */
    const mainFormRef = useRef<ProFormInstance>();
    const generateMainForm: BaseSchemaFormProps = {
      columns: formColumns,
      initialValues: operateCurrent,
      disabled: !processAuth,
      formRef: mainFormRef,
      ...schemaFormConfig,
    };

    /** 保存成功后 回填单据信息 */
    const handleProcessOnSaveFinish = async (res: FETCH.Row) => {
      if (res?.status !== 'SUCCESS') return;
      /** 获取新的主单据 */
      const queryRes = await businessQueryOne(commitUrl, res?.rows?.id);
      const queryResRows = queryRes?.rows

      setOperateCurrent({ ...operateCurrent, ...queryResRows });
      /** 表单回填 */
      mainFormRef?.current?.setFieldsValue({ ...queryResRows });
    };

    /** 保存方法 */
    const processOnSave = async (params: SYS.WorkflowSaveCallbackParams) => {
      /** 校验表单 */
      const mainFormValues = await mainFormRef?.current?.validateFieldsReturnFormatValue?.();
      const { workflowKey } = params;

      const res = await API.${editData?.apiName}({ ...mainFormValues, id: operateCurrent?.id, workflowKey });
      handleProcessOnSaveFinish(res);
      return res;
    };

    /** 校验函数 */
    const processValidateFieldsForms = async () => {
      await mainFormRef?.current?.validateFields();
    };

    /** 流程参数 */
    const processBusinessParams = async () => {
      return {};
    };

    const processParams: ProcessBusinessProps = {
      commitUrl,
      validateFieldsForms: processValidateFieldsForms,
      fromParams: processBusinessParams,
      onSave: processOnSave,
      current: operateCurrent,
      setProcessAuth,
      formType,
    };

    const MainContent = (
      <>
        <SpaceView>
          <BaseCard bordered type="H2" title="主单据信息">
            <BaseSchemaForm {...generateMainForm} />
          </BaseCard>
        </SpaceView>
        <SpaceView disable={!operateCurrent?.id}>
          <BaseCard bordered type="H2" title="附件">
            <section style={{ height: 320 }}>
              <AnnexTable
                deleted={processAuth}
                upload={processAuth}
                businessId={operateCurrent?.id}
                uploadParams={{}}
              ></AnnexTable>
            </section>
          </BaseCard>
        </SpaceView>
      </>
    );

    const tabItems = [
      {
        label: '主单据信息',
        key: 'tab1',
        children: MainContent,
      },
      {
        label: '其他信息',
        key: 'tab2',
        children: (
          <SpaceView style={{ height: '100%' }} disable={!operateCurrent?.id}>
            <BaseCard bordered type="H2" title="其他信息">
              <MyComponent
                operateCurrent={operateCurrent}
                processAuth={processAuth}
              />
            </BaseCard>
          </SpaceView>
        ),
      },
    ];

    return (
      <ProcessBusiness {...processParams} tabs={{ type: 'card', animated: true }}>
        {tabItems.map((item) => (
          <BaseCard.TabPane tab={item.label} key={item.key}>
            {item.children}
          </BaseCard.TabPane>
        ))}
      </ProcessBusiness>
    );
  };
  `;
};

const getNormalCode = () => {
  const { listData, editData } = getApiData({ formModel });

  return `
  import { useRef, useState } from 'react';
  import { Button,message } from 'antd';
  import { SaveOutlined } from '@ant-design/icons';
  import { ProFormInstance } from '@ant-design/pro-form';

  import { businessQueryOne } from '@/common/process/ProcessMainForm/services';
  import { BaseSchemaFormProps } from 'jd-framework-web/package/components';
  import SpaceView from 'jd-framework-web/package/components/ViewContainer/SpaceView';
  import BaseCard from 'jd-framework-web/package/components/BaseCard';
  import BaseSchemaForm from 'jd-framework-web/package/components/BaseSchemaForm';
  import AnnexTable from 'jd-framework-web/package/common/annex/AnnexTable';
  import { LAYOUTCOL } from '@/common/constant/layoutCol';

  import useMainFormColumns from './useMainFormColumns';
  import * as TYPES from '../typings';
  import * as API from '../services';

  type DefineProps = {
    formType: SYS.FormType;
    operateCurrent?: TYPES.${listData?.tsName};
  };

  /** 表单通用配置 */
  const schemaFormConfig: Omit<BaseSchemaFormProps, 'columns' | 'layoutType'> = {
    ...LAYOUTCOL.defaultLayout,
    labelCol: { style: { width: 140 } },
    wrapperCol: { span: 'auto', style: { marginRight: 24 } },
    submitter: false,
    grid: true,
  };

  /** 主单据详情 */
  export default (props: DefineProps) => {
    const { formType } = props;

    /** 流程前缀或查询queryOne前缀 */
    // const commitUrl = '${formModel.commitUrl}';
    /** 非新增取当前行 */
    const formCurrent = props.formType === 1 ? undefined : props.operateCurrent;
    const { formColumns } = useMainFormColumns();

    /** 操作行数据重置 */
    const [operateCurrent, setOperateCurrent] = useState<TYPES.${listData?.tsName} | undefined>(formCurrent);

    /** 主单据loading */
    const [saveLoading, setSaveLoading] = useState(false);

    /** 业务单据信息 */
    const mainFormRef = useRef<ProFormInstance>();
    const generateMainForm: BaseSchemaFormProps = {
      columns: formColumns,
      initialValues: operateCurrent,
      disabled: !formType,
      formRef: mainFormRef,
      ...schemaFormConfig,
    };

    /** 保存成功后 回填单据信息  */
    const handleOnSaveFinish = async (res: FETCH.Row) => {
      if (res?.status !== 'SUCCESS') return;
      /** 获取新的主单据 */
      const queryRes = await businessQueryOne(commitUrl, res?.rows?.id);
      const queryResRows = queryRes?.rows;

      setOperateCurrent({ ...operateCurrent, ...queryResRows });
      /** 表单回填 */
      mainFormRef?.current?.setFieldsValue({ ...queryResRows });
    };

    /** 保存方法 */
    const handleOnSave = async () => {
      /** 校验表单 */
      const mainFormValues = await mainFormRef?.current?.validateFieldsReturnFormatValue?.();
      try {
        setSaveLoading(true);
        const res = await API.${editData?.apiName}({ ...mainFormValues, id: operateCurrent?.id });
        if (res?.status === 'SUCCESS') {
          message.success(res?.message || '保存成功');
        }
        handleOnSaveFinish(res);
      } finally {
        setSaveLoading(false);
      }
    };

    const mainTitle = (
      <Button
        type="primary"
        onClick={handleOnSave}
        style={{ marginRight: 5 }}
        loading={saveLoading}
        icon={<SaveOutlined />}
      >
        保存
      </Button>
    );

    const MainContent = (
      <>
        <SpaceView>
          <BaseCard bordered type="H2" title="主单据信息">
            <BaseSchemaForm {...generateMainForm} />
          </BaseCard>
        </SpaceView>
        <SpaceView disable={!operateCurrent?.id}>
          <BaseCard bordered type="H2" title="附件">
            <section style={{ height: 320 }}>
              <AnnexTable
                deleted={!!formType}
                upload={!!formType}
                businessId={operateCurrent?.id}
                uploadParams={{}}
              ></AnnexTable>
            </section>
          </BaseCard>
        </SpaceView>
      </>
    );

    const tabItems = [
      {
        label: '主单据信息',
        key: 'tab1',
        children: MainContent,
      },
      {
        label: '其他信息',
        key: 'tab2',
        children: (
          <SpaceView style={{ height: '100%' }} disable={!operateCurrent?.id}>
            <BaseCard bordered type="H2" title="其他信息">
              <MyComponent
                operateCurrent={operateCurrent}
                processAuth={processAuth}
              />
            </BaseCard>
          </SpaceView>
        ),
      },
    ];

    return (
    <section style={{ height: 500 }}>
      <BaseCard
        title={!!formType && mainTitle}
        headerBordered={false}
        extraFullScreen={false}
        tabs={{ type: 'card', animated: true, items: tabItems }}
      ></BaseCard>
    </section>
    );
  };
  `;
};

const generateCode = () => {
  const CODE = `
${getModuleExplain(formModel, '主单据')}

${(formModel.mainDetailsType === 'flow' && getFlowCode()) || ''}
${(formModel.mainDetailsType === 'normal' && getNormalCode()) || ''}
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
