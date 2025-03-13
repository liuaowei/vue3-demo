/**
*  @param data 数据源
*  @param colums 对应数据字段名
*  @param titleData Excel对应表头字段
*  @param name 导出表名
*/
import ExportJsonExcel from 'js-export-excel'
export const exportExcel: any = (data: any, colums: any, titleData: any, name: any) => {
    // 数据重构方法
    name = 'test'
    const newa = (value: any) => {
        for (let i in value) {
            // 数据为空则修改为 '--'
            if (!value?.[i]) {
                value[i] = '--'
            }
            // 筛选并格式化时间数据 
            else if (String(value?.[i])?.includes('+08:00')) {
                value[i] = new Date(value[i]).toLocaleString()
            }
        }
        return value
    }

    // 获取最新数据
    let newdata: any = []
    data?.forEach((item: any) => {
        //调用数据重构方法，将空值或者时间数据格式化
        newdata?.push(newa(item))
    })

    // 排除 操作和物料图片
    const TitleData = titleData?.filter((item: any) => item !== '操作' && item !== '物料图片')
    // 去掉空值
    const newCloums = colums?.filter((item: any) => item)
    let option: any = {};
    option.fileName = name;
    option.datas = [
        {
            sheetData: newdata || [],
            sheetName: name,
            sheetFilter: newCloums,
            sheetHeader: TitleData,
            columnWidths: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,]

        }
    ]
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    return {
        exportExcel
    }
}