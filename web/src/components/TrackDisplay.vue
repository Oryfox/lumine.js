<script setup lang="ts">
const { item } = defineProps<{ item: SpotifyTrack }>()

item.selected = true
</script>

<template>
<div class="song-selector" @click="item.selected = !item.selected">
  <input type="checkbox" v-model="item.selected" />

  <img :src='item.album.images.find(i => i.width === 64)!.url' alt="Artwork" />

  <div class="title-artist">
    <span class="title">{{ item.name }}</span>
    <span class="artist">{{ item.artists.map(a => a.name).join(", ") }}</span>
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