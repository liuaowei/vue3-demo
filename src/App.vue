<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import BaseButton from "./components/BaseButton/BaseButton";

const handleClickButton = () => {
  console.log("123");
};
</script>

<template>
  <div class="main">
    <BaseButton
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
      @click="handleClickButton"
    >
      123
    </BaseButton>
  </div>
</template>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  place-items: center;
}
</style>
