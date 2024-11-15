import { useTemplateRef } from 'vue';

type CopyParams = {
  templateName: string;
};
export const useCopy = (params: CopyParams) => {
  const { templateName } = params;
  const baseCodeRef = useTemplateRef<{ copyCode: () => void }>(templateName);
  return {
    copyCode: () => baseCodeRef.value?.copyCode?.()
  };
};
