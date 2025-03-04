import {ref, computed} from 'vue'
import {defineStore} from 'pinia'

export const useStore = defineStore('store', () => {
  const spotifyToken = ref<SpotifyToken | null>(null)
  const spotifyUser = ref<SpotifyUser | null>(null)

  return { spotifyToken, spotifyUser }
})
