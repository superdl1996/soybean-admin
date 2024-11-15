import dayjs from 'dayjs';

// --------------公共模块数组---------------------

/** 生成时间 年-月-日 时:分:秒 */
export const getTime = () => dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

/** 生成首字母大写字符串 */
const getFirstUpperCase = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1);

// --------------组件模块---------------------

/** Action */
export interface GenerateAction {
  /** 模块名字 */
  name: string;
  /** 生成代码 */
  generateCode: () => void;
  /** 复制代码 */
  copyCode: () => void;
}

/** 生成条件 */
export interface FormModel {
  /** 表格key */
  persistenceKey: string;
  /** 文件名 */
  fileName: string;
  /** 模块名称(注释用) */
  moduleName: string;
  /** 作者(注释用) */
  author: string;
  /** 邮箱(注释用) */
  email: string;
  /** 列表接口 */
  tableListApi: string;
  /** 新增/编辑接口 */
  tableEditApi: string;
  /** 删除接口 */
  tableDelApi: string;
  /** 上移下移接口 */
  tableSortApi: string;
  /** 导入接口 */
  tableImportApi: string;
  /** 导出接口 */
  tableExportApi: string;
  /** 生成ts类型的原始数据 */
  typeSchema: string;
  /** 生成表格类型 main:修改ts类型输出位MainTaleList sub:SubTaleList */
  tableType: string;
  /** 校正及补充生成ts类型数据 */
  typeSchemaCheck: string;
  /** TS重命名 */
  resetTsName: string;
}

/** 生成模块注释 */
export const getModuleExplain = (formModel: FormModel) => {
  return `/*
  * @Author: ${formModel.author}
  * @Date: ${getTime()}
  * @LastEditors: ${formModel.email}
  * @LastEditTime: ${getTime()}
  * @Description: ${formModel.moduleName}
  */`;
};

const explainDict: Partial<Record<keyof FormModel, string>> = {
  tableListApi: '列表',
  tableEditApi: '新增/编辑',
  tableDelApi: '删除',
  tableSortApi: '上移下移',
  tableImportApi: '导入',
  tableExportApi: '导出'
};

/**
 * 生成函数注释
 *
 * @param formModel 表单数据
 * @param description 功能描述
 */
export const getFunctionExplain = (formModel: FormModel, key: keyof typeof explainDict) => {
  if (!formModel[key]) return '';
  return `/**
 * @Author: ${formModel.author}
 * @Date: ${getTime()}
 * @Description: ${explainDict[key]}
 */`;
};

/** 根据接口路径生成数据 */
const formatApi = (params: { type?: string; apiUrl: string; formModel: FormModel }) => {
  const { apiUrl, formModel } = params;
  if (!apiUrl) return undefined;
  // 以 列表 api-link为主生成各种主列表需要的变量
  const nameArray = apiUrl.split('/');
  const nameLen = nameArray.length;
  const nameBefore = nameArray[nameLen - 2];
  const nameAfter = nameArray[nameLen - 1].split('.')[0];

  // 截取api路径
  const parseApis = [...nameArray];
  if (parseApis[0].includes('{{')) {
    parseApis.shift();
  }

  const parseApisStr = parseApis.join('/');
  const publicReturn = {
    /** 接口名称 驼峰 */
    apiName: nameBefore + getFirstUpperCase(nameAfter),
    /** 接口路径 */
    apiPath: `${parseApisStr.startsWith('/') ? parseApisStr : `/${parseApisStr}`}`
  };
  const listReturn = {
    ...publicReturn,
    /** 生成state的current */
    currentState: [`${nameBefore}Current`, `set${getFirstUpperCase(nameBefore)}Current`],
    /** ts名字 */
    tsName: getFirstUpperCase(formModel.resetTsName) || `${getFirstUpperCase(nameBefore)}ListItem`,
    /** table key */
    persistenceKey: formModel.persistenceKey.toUpperCase() || `${nameBefore.toUpperCase()}TABLE`
  };
  return listReturn;
};

/** 获取接口数据 */
export const getApiData = (params: { formModel: FormModel }) => {
  const { formModel } = params;
  const listData = formatApi({ apiUrl: formModel.tableListApi, formModel });
  const editData = formatApi({ apiUrl: formModel.tableEditApi, formModel });
  const delData = formatApi({ apiUrl: formModel.tableDelApi, formModel });
  const sortData = formatApi({ apiUrl: formModel.tableSortApi, formModel });
  const importData = formatApi({ apiUrl: formModel.tableImportApi, formModel });
  const exportData = formatApi({ apiUrl: formModel.tableExportApi, formModel });
  return {
    listData,
    editData,
    delData,
    sortData,
    importData,
    exportData
  };
};

/** 根据参数返回str */
export const formatEmptyStr = (data: any, str: string) => {
  return data ? str : '';
};

// --------------Ts类型生成模块---------------------
/** 将数据转换TS类型数组 */
const getTsDataToArray = (str: string) => {
  const regex = /\s/g;
  const text = str.replace(regex, '#');
  const textArray = text.split('#');
  return textArray;
};

/** 根据校验数据校正TS类型 根据 https://tooltt.com/json2typescript生成 */
export const checkTsData = (formModel: FormModel) => {
  const verifyTsText = formModel.typeSchemaCheck;
  const regex = /\s|{|}/g;
  const verifyTsText1 = verifyTsText.replace(regex, '');
  const verifyTsArray = verifyTsText1.slice(verifyTsText1.indexOf('RootObject') + 'RootObject'.length).split(';');
  const typeSchema = getTsDataToArray(formModel.typeSchema);
  if (!verifyTsArray.length) return typeSchema;
  /** 生成校正 [[key,string]] 类型 */
  const verifyTsArray1 = verifyTsArray.map(item => {
    const itemToArray = item.split(':');
    return itemToArray;
  });

  const addSchema = [];
  typeSchema.forEach((item, index) => {
    for (const [_, verifyItem] of verifyTsArray1.entries()) {
      if (item === verifyItem[0]) {
        typeSchema[index + 1] = verifyItem[1];
        return;
      }
    }
  });

  /** 找到原始数据未有的ts添加进去 */
  for (const [_, verifyItem] of verifyTsArray1.entries()) {
    if (!typeSchema.includes(verifyItem[0])) addSchema.push(...verifyItem, '');
  }

  typeSchema.push(...addSchema);

  return typeSchema;
};

// --------------Columns模块---------------------
export const generateTsToColumns = (formModel: FormModel) => {
  const textArray = checkTsData(formModel);
  const result: any[] = [];
  textArray.forEach((item, index) => {
    if (['boolean', 'string', 'number'].includes(item)) {
      result.push({
        title: textArray[index + 1],
        dataIndex: textArray[index - 1]
      });
    }
  });
  return result;
};
