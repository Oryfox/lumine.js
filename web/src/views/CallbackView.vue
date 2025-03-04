<script setup lang="ts">
import {useStore} from "@/stores/store.ts";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useSpotify} from "@/composables/spotify.ts";

const router = useRouter()
const spotify = useSpotify()
const message = ref("Checking token...")
const store = useStore()
const regex = /^#access_token=(.+)&token_type=(.+)&expires_in=(\d+)$/
const match = window.location.hash.match(regex)
if (match) {
  store.spotifyToken = {
    access_token: match[1],
    token_type: match[2],
    expires_in: parseInt(match[3])
  }
  spotify.loadUser()
  router.push("/")
} else {
  message.value = "Could not parse a token"
}
</script>

<template>
<div>
  {{ message }}
</div>
</template>

<style scoped>

</style>