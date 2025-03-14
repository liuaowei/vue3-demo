<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElButton,
  ElUpload,
  ElTable,
  ElTableColumn,
} from "element-plus";
import * as XLSX from "xlsx";

const transpose = (array: any[][]): any[][] => {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
};

const tableData = ref([]);

// 上传之前的回调
const handleBeforeUpload = (file: File) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 跳过第一行（表头行），并将后续的数据转换为对象数组
    const dataObjects = json.slice(1).map((row: any) => {
      if (row.length >= 2) {
        return { request: row[0], r_json: row[1] };
      }
      return { request: row[0], r_json: "" }; // 如果第二列为空，则 r_json 为空字符串
    });

    console.log("Excel data as object array:", dataObjects);
    tableData.value = dataObjects;
  };

  reader.readAsArrayBuffer(file);

  return false; // 阻止默认的上传行为
};

// 全部解析
const handleParseAll = async () => {
  let message = [];
  message = tableData.value;
  try {
    const response: any = await fetch("http://127.0.0.1:5000/api/batch_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    console.log("response:", response);
    tableData.value = response.message;
    console.log("tableData.value:", tableData.value);
  } catch (error) {}
};

// 解析
const handleParse = async (request: string, index: number) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: request }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("index:", index);
    tableData.value[index] = {
      request: request,
      r_json: data || {},
    };
    console.log("tableData:", tableData.value);
    console.log("data:123", data.entity);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// 导出结果
const exportResult = () => {
  if (tableData.value.length === 0) {
    console.warn("没有数据可供导出");
    return;
  }

  // 将 tableData 转换为二维数组
  const data = [
    [
      "诉求文本",
      "问题实体",
      "问题摘要",
      "反映时间",
      "联系方式",
      "发生地点",
      "反映诉求",
      "诉求分析",
      "指派部门",
      "指派依据",
    ],
    ...tableData.value.map((row) => [
      row.request,
      row.r_json.entity,
      row.r_json.summary,
      row.r_json.time,
      row.r_json.telephone,
      row.r_json.location,
      row.r_json.demand,
      row.r_json.demand_analysis,
      row.r_json.assign_department,
      row.r_json.basis_of_assign,
    ]),
  ];

  // 创建工作簿
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 导出 Excel 文件
  XLSX.writeFile(workbook, "result.xlsx");
};

onMounted(() => {});
</script>

<template>
  <div class="main">
    <h1>12345市长热线分析系统</h1>
    <el-card class="content" shadow="never">
      <template #header>
        <div style="display: flex; align-items: center">
          <el-upload
            :multiple="false"
            accept=".xlsx"
            :before-upload="handleBeforeUpload"
            :show-file-list="false"
          >
            <el-button type="primary">上传Excel表单</el-button>
          </el-upload>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="handleParseAll"
          >
            全部解析
          </el-button>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="exportResult"
          >
            导出结果
          </el-button>
          <el-button style="margin-left: 10px" type="primary">
            切换模型
          </el-button>
        </div>
      </template>

      <template #default>
        <el-table height="800" :data="tableData">
          <el-table-column
            prop="request"
            label="诉求文本"
            width="300"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="问题实体" prop="entity" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.r_json.entity }}
            </template>
          </el-table-column>
          <el-table-column
            label="问题摘要"
            prop="summary"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.r_json.summary }}
            </template>
          </el-table-column>
          <el-table-column label="反映时间" prop="time" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.time }}
            </template>
          </el-table-column>
          <el-table-column
            label="联系方式"
            prop="telephone"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.r_json.telephone }}
            </template>
          </el-table-column>
          <el-table-column
            label="发生地点"
            prop="location"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.r_json.location }}
            </template>
          </el-table-column>
          <el-table-column label="反映诉求" prop="demand" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.r_json.demand }}
            </template>
          </el-table-column>
          <el-table-column
            label="诉求分析"
            prop="demand_analysis"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.r_json.demand_analysis }}
            </template>
          </el-table-column>
          <el-table-column
            label="指派部门"
            prop="assign_department"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.r_json.assign_department }}
            </template>
          </el-table-column>
          <el-table-column
            label="指派依据"
            prop="basis_of_assign"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.r_json.basis_of_assign }}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                link
                @click="handleParse(scope.row.request, scope.$index)"
              >
                解析
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.main {
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  padding: 40px 80px;
  h1 {
  }
  .content {
    margin-top: 20px;
    height: 1000px;
    width: 100%;
  }
}
</style>
