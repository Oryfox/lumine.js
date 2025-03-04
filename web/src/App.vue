<script setup lang="ts">
import UserPane from "@/components/UserPane.vue";
</script>

<template>
  <div class="main">
    <RouterView />
  </div>

  <UserPane id="user-pane" />
</template>

<style scoped>
.main {
  padding: 1rem;
}

#user-pane {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>
