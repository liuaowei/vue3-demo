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
const handleParseAll = (index: number) => {
  if (tableData.value.length == 0) {
    return;
  }
  let item = tableData.value[index];
  handleParse(item.request, index).then((response: any) => {
    tableData.value[index] = {
      ...tableData.value,
      r_json: response,
      entity: response.entity,
      summary: response.summary,
      time: response.time,
      telephone: response.telephone,
      location: response.location,
      demand: response.demand,
      demand_analysis: response.demand_analysis,
      assign_department: response.assign_department,
      basis_of_assign: response.basis_of_assign,
    };
    index++;
    handleParseAll(index);
    if (index == tableData.value.length) {
      return;
    }
  });
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
      entity: data.entity || "",
      summary: data.summary || "",
      time: data.time || "",
      telephone: data.telephone || "",
      location: data.location || "",
      demand: data.demand || "",
      demand_analysis: data.demand_analysis || "",
      assign_department: data.assign_department || "",
      basis_of_assign: data.basis_of_assign || "",
    };
    console.log("tableData:", tableData.value);
    console.log("data:123", data.entity);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// 导出结果
const exportResult = () => {};

onMounted(() => {});
</script>

<template>
  <div class="main">
    <h1>12345问题解析</h1>
    <el-card class="content" shadow="false">
      <template #header>
        <el-upload
          :multiple="false"
          accept=".xlsx"
          :before-upload="handleBeforeUpload"
          :show-file-list="false"
        >
          <el-button type="primary">上传Excel表单</el-button>
        </el-upload>
      </template>

      <template #default>
        <el-button type="primary" @click="handleParseAll(0)">
          全部解析
        </el-button>
        <el-button type="primary" @click="exportResult">导出结果</el-button>
        <el-table height="800" :data="tableData">
          <el-table-column
            prop="request"
            label="诉求文本"
            width="300"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="问题实体" prop="entity" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="问题摘要"
            prop="summary"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="反映时间" prop="time" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="联系方式"
            prop="telephone"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="发生地点"
            prop="location"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="反映诉求" prop="demand" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="诉求分析"
            prop="demand_analysis"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="指派部门"
            prop="assign_department"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="指派依据"
            prop="basis_of_assign"
            show-overflow-tooltip
          >
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
