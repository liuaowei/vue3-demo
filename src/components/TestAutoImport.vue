<template>
  <div>
    <h1>Vue 和 VueUse 自动导入测试</h1>

    <!-- 测试 Vue 的 ref -->
    <p>计数器: {{ counter }}</p>
    <el-button type="primary" @click="increment">增加</el-button>

    <!-- 测试 VueUse 的 useMouse -->
    <p>鼠标位置: X: {{ x }}, Y: {{ y }}</p>

    <!-- 测试 VueUse 的 usePreferredDark -->
    <p>系统偏好深色模式: {{ isDark ? "是" : "否" }}</p>
  </div>
</template>

<script setup>
// 注意：这里我们没有手动导入任何内容！
// 如果配置正确，以下内容应该可以正常工作。

// 使用 Vue 的 ref
const counter = ref(0);
function increment() {
  counter.value++;
}

// 使用 VueUse 的 useMouse
const { x, y } = useMouse();

// 使用 VueUse 的 usePreferredDark
const isDark = usePreferredDark();
</script>

<style scoped>
button {
  margin-top: 10px;
}
</style>
