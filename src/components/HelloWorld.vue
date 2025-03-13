<script setup lang="ts">
import { ref } from "vue";
import { ElButton } from "element-plus";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <el-button type="primary">123</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
