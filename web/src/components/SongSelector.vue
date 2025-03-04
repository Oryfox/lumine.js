<script setup lang="ts">
const { item } = defineProps<{ item: APItem }>()
</script>

<template>
<div class="song-selector" @click="item.selected = !item.selected">
  <img :src='item.artwork.dictionary.url.replace("{w}", "64").replace("{h}", "64").replace("{f}", "jpg")' alt="Artwork" />

  <div class="title-artist">
    <span class="title">{{ item.title }}</span>
    <span class="artist">{{ item.artistName }}</span>
  </div>
</div>
</template>

<style scoped>
.song-selector {
  display: flex;
  align-items: center;
  gap: .5rem;
  white-space: nowrap;
}
img {
  width: 48px;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.title-artist {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.title {
  font-size: medium;
  font-weight: bold;
}

.artist {
  font-size: small;
  color: gray;
  margin-top: -.2rem;
}
</style>