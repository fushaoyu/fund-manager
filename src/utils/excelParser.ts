import * as XLSX from 'xlsx-js-style';

/**
 * 读取Excel文件并返回表头
 * @param file - 上传的Excel文件（File对象）
 * @param sheetName - 工作表名称（默认取第一个工作表）
 * @returns 转换后的IUserFundsItem数组
 */
export const excelParser = async (
  file: File,
  sheetName?: string,
): Promise<{
  headerRow: string[];
  dataRows: string[][];
}> => {
  // 1. 读取Excel文件为ArrayBuffer
  const arrayBuffer = await readFileAsArrayBuffer(file);
  // 2. 解析Excel工作簿
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  // 3. 选择目标工作表（默认取第一个）
  const targetSheetName = sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[targetSheetName!];
  if (!worksheet) throw new Error(`工作表 "${targetSheetName}" 不存在`);
  // 4. 将工作表转换为JSON（header: 1 表示用第一行作为表头）
  const excelJson = XLSX.utils.sheet_to_json<string[]>(worksheet, {
    header: 1,
    raw: false, // 不保留原始格式，转为字符串便于处理
    defval: '', // 空单元格默认值为''
  });
  // 5. 提取表头和数据（第一行为表头，从第二行开始为数据）
  const [headerRow, ...dataRows] = excelJson;
  if (dataRows.length === 0) throw new Error('Excel文件中无有效数据');
  return {
    headerRow: headerRow || [],
    dataRows,
  };
};

/**
 * 读取文件为ArrayBuffer
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) resolve(result);
      else reject(new Error('文件读取失败，格式不正确'));
    };
    reader.onerror = () => reject(new Error('文件读取错误'));
    reader.readAsArrayBuffer(file);
  });
};
