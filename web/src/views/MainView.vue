<script setup lang="ts">
import {useStore} from "@/stores/store.ts";
import {ref} from "vue";
import SongSelector from "@/components/SongSelector.vue";
import TrackDisplay from "@/components/TrackDisplay.vue";
import {useSpotify} from "@/composables/spotify.ts";

const spotify = useSpotify()
const store = useStore()

const urlInput = ref()
const playlist = ref<AppleMusicPlaylist>()
const spotifyTracks = ref<SpotifyTrack[]>([])
const spotifyPlaylistName = ref<string>()
const blockUpload = ref(false)

if (store.spotifyToken === null) {
  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent('d85da33f849c462b9249819b933e7723');
  url += '&scope=' + encodeURIComponent('playlist-modify-private user-read-private ugc-image-upload');
  url += '&redirect_uri=' + encodeURIComponent(`${window.location.origin}/callback`);

  window.location.href = url;
}

const loadAppleMusicPlaylist = () => {
  fetch(import.meta.env.VITE_PROXY_PREFIX + urlInput.value)
      .then(res => res.json())
      .then(data => playlist.value = data)
}

const searchSpotify = () => {
  spotifyPlaylistName.value = playlist.value?.data.sections[0].items[0].title || ""
  spotify.searchSpotifyTracks(playlist.value!, spotifyTracks.value)
}

const uploadPlaylist = async () => {
  if (blockUpload.value)
    return
  blockUpload.value = true
  const playlistId = await spotify.createSpotifyPlaylist(spotifyPlaylistName.value || "Imported Playlist from Lumine", playlist.value?.data?.sections[0]?.items[0]?.modalPresentationDescriptor?.paragraphText)

  await spotify.addTracksToPlaylist(playlistId, spotifyTracks.value.filter(t => t.selected).map(track => track.id))

  const imageRes = await fetch(playlist.value!.data.sections[0].items[0].artwork.dictionary.url.replace('{w}', '128').replace('{f}', 'jpg').replace('{h}', '128'))
  const bytes = (await imageRes.bytes())
  const base64 = btoa(String.fromCharCode.apply(null, bytes as never as number[]))
  await spotify.addImageToPlaylist(playlistId, base64)

  alert("Playlist uploaded successfully.")
  blockUpload.value = true
}
</script>

<template>
  <div>
    <header>
      <input v-model="urlInput" type="url" placeholder="Apple Music Playlist URL" @keyup.enter="loadAppleMusicPlaylist">
      <button @click="loadAppleMusicPlaylist">Load</button>
    </header>

    <div class="split-view">
      <div class="split-content" v-if="playlist">
        <div class="playlist-title">
          <img :src="playlist.data.sections[0].items[0].artwork.dictionary.url.replace('{w}', '128').replace('{f}', 'jpg').replace('{h}', '128')"  alt="Playlist Image" />
          <div>
            <h1 style="font-weight: 600">{{ playlist.data.sections[0].items[0].modalPresentationDescriptor!.headerTitle }}</h1>
            <h2 style="color: gray">{{ playlist.data.sections[0].items[0].modalPresentationDescriptor!.headerSubtitle }}</h2>
          </div>
        </div>

        <div class="song-list">
          <SongSelector v-for="item in playlist.data.sections[1].items" :item="item" />
        </div>
      </div>

      <div class="split-content" v-if="playlist">
        <button @click="searchSpotify" v-if="spotifyTracks.length === 0">Search now</button>

        <div class="playlist-title" v-if="spotifyTracks.length > 0">
          <img :src="playlist.data.sections[0].items[0].artwork.dictionary.url.replace('{w}', '128').replace('{f}', 'jpg').replace('{h}', '128')"  alt="Playlist Image"/>
          <div style="display: flex; flex-direction: column; flex: 1">
            <input style="font-weight: 600; font-size: 22px" v-model="spotifyPlaylistName" placeholder="New playlist name" />
            <button @click="uploadPlaylist" :disabled="blockUpload">Upload new Playlist to Spotify</button>
          </div>
        </div>

        <div class="song-list">
          <TrackDisplay v-for="item in spotifyTracks" :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}

input {
  flex: 1;
  padding: .5rem;
  border-radius: .3rem;
  border-color: var(--color-border);
  border-width: 1px;
  outline: none;
}

.split-view {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;

  .split-content {
    flex: 1;

    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: .3rem;
  }
}

.song-list {
  margin-top: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playlist-title {
  display: flex;
  gap: 1rem;

  img {
    width: 96px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }
}
</style>
