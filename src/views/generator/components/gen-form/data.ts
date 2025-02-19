/** tableType 的 value */
export const tableTypeMap = {
  DEFAULT: 'DefaultTable',
  MAIN: 'MainTable',
  SUB: 'SubTable'
} as const;

/** 主单据的 的 list */
export const mainDetailList = [
  {
    type: 'none',
    name: '无主单据'
  },
  {
    type: 'flow',
    name: '有流程'
  },
  {
    type: 'normal',
    name: '无流程'
  }
] as const;

export type MainDetailListType = (typeof mainDetailList)[number]['type'];
