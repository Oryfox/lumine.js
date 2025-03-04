<script setup lang="ts">
import {useStore} from "@/stores/store.ts";

const store = useStore()
</script>

<template>
<div v-if="store.spotifyUser" class="outer-panel">
  <div class="user-info">
    <img :src="store.spotifyUser.images.find(image => image.width === 64)!.url" alt="Spotify Image" />
    <h2>{{ store.spotifyUser.display_name }}</h2>
  </div>
</div>
</template>

<style scoped>
.outer-panel {
  padding: .7rem;
  border: 1px solid var(--color-border);
  border-radius: .5rem;
  background: var(--color-background);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

img {
  width: 48px;
  aspect-ratio: 1/1;
  object-fit: cover;

  border-radius: 50%;
}

h2 {
  font-weight: 600;
}
</style>