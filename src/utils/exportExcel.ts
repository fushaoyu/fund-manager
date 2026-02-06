// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

export const exportExcel = <T>(data: T[], exportFields: Record<string, string>, fileName: string = "养基宝持仓数据") => {
    return new Promise((resolve, reject) => {
        try {
            // 转换数据为Excel兼容格式（仅保留需要的字段）
            const exportData = data.map(item => {
                const row: Record<string, any> = {};
                Object.keys(exportFields).forEach(key => {
                    const header = exportFields[key as keyof typeof exportFields];
                    header !== undefined && (row[header] = (item as any)[key as keyof IFundStore.IUserFundsItem]);
                });
                return row;
            });
            // 创建工作簿和工作表
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const headerRowKeys = Object.keys(worksheet).filter(key => key.match(/^[A-Z]+1$/));
            headerRowKeys.forEach(cellKey => {
                worksheet[cellKey].s = {
                    font: {
                        bold: true,
                        sz: 12,
                        color: { rgb: '000000' } // 字体黑色
                    },
                    fill: {
                        fgColor: { rgb: 'e6e6fa' }
                    },
                    // 对齐：水平+垂直居中
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center'
                    },
                    // 边框：所有边框（细黑线）
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    }
                };
            });
            // 先获取列名对应的列字母（如“当日收益(元)”对应I列，“持有收益(元)”对应J列）
            const colLetterMap = getColLetterMap(worksheet);
            const profitCols = ['当日收益(元)', '持有收益(元)']; // 需要上色的列
            profitCols.forEach(colName => {
                const colLetter = colLetterMap[colName];
                if (!colLetter) return;

                Object.keys(worksheet).forEach(cellKey => {
                    if (cellKey.startsWith(colLetter) && !cellKey.endsWith('1')) {
                        const cell = worksheet[cellKey];
                        const value = cell.v; // 单元格原始值
                        cell.s = {
                            font: {
                                color: { rgb: value > 0 ? 'ff0000' : value < 0 ? '008000' : '000000' }
                            },
                            number: { format: '0.00' }, // 数值格式：保留2位小数
                            border: { // 加细边框
                                top: { style: 'thin' },
                                bottom: { style: 'thin' },
                                left: { style: 'thin' },
                                right: { style: 'thin' }
                            }
                        }
                    }
                });
            });
            worksheet['!cols'] = profitCols.map(colName => ({
                wch: colName.length * colName.length
            }));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, '基金持仓数据');

            // 4. 生成并下载Excel文件
            XLSX.writeFile(workbook, `${fileName}_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    })
};

/**
 * 辅助函数：获取列名→列字母的映射（如“基金代码”→A，“基金名称”→B）
 * @param worksheet 工作表对象
 * @returns 列名-列字母映射
 */
const getColLetterMap = (worksheet: XLSX.WorkSheet) => {
    const colLetterMap: Record<string, string> = {};
    // 遍历第一行（表头行）的单元格
    Object.keys(worksheet).forEach(cellKey => {
        if (cellKey.match(/^[A-Z]+1$/)) {
            const colLetter = cellKey.replace('1', ''); // 提取列字母（如A1→A）
            const colName = worksheet[cellKey].v; // 提取列名（如“基金代码”）
            colLetterMap[colName] = colLetter;
        }
    });
    return colLetterMap;
};