import {useStore} from "@/stores/store.ts";

export function useSpotify() {
  const store = useStore()

  const loadUser = () => {
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `${store.spotifyToken!.token_type} ${store.spotifyToken!.access_token}`,
      }
    }).then(async response => {
      store.spotifyUser = await response.json()
    })
  }

  const searchSpotifyTracks = async (playlist: AppleMusicPlaylist, spotifyTracks: SpotifyTrack[]) => {
    for (let track of playlist.data.sections[1].items) {
      const title = track.title
      const artist = track.artistName
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(title + ' ' + artist)}&type=track&limit=1`, {
        headers: {
          Authorization: `${store.spotifyToken!.token_type} ${store.spotifyToken!.access_token}`,
        }
      })

      if (res.ok) {
        const data = await res.json()

        if (data) {
          spotifyTracks.push(data.tracks.items[0])
        }
      } else {
        console.log(`${title} - ${artist} not found`)
      }
    }
  }

  const createSpotifyPlaylist = async (name: string, description?: string): Promise<string> => {
    const response = await fetch(`https://api.spotify.com/v1/users/${store.spotifyUser!.id}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `${store.spotifyToken!.token_type} ${store.spotifyToken!.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
        public: false,
      })
    })

    if (response.status !== 201) {
      throw new Error('Error creating playlist')
    }

    const data = await response.json()
    return data.id
  }

  const addTracksToPlaylist = async (playlistId: string, trackIds: string[]) => {
    const chunks = []
    for (let i = 0; i < trackIds.length; i += 100) {
      chunks.push(trackIds.slice(i, i + 100))
    }

    for (let i = 0; i < chunks.length; i++) {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `${store.spotifyToken!.token_type} ${store.spotifyToken!.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: chunks[i].map(id => `spotify:track:${id}`)
        })
      })

      if (res.status !== 201) {
        throw new Error('Error adding track to playlist')
      }
    }
  }

  const addImageToPlaylist = async (playlistId: string, b64String: string) => {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
      method: 'PUT',
      headers: {
        Authorization: `${store.spotifyToken!.token_type} ${store.spotifyToken!.access_token}`,
        'Content-Type': 'image/jpeg',
      },
      body: b64String
    })
  }

  return {
    loadUser,
    searchSpotifyTracks,
    createSpotifyPlaylist,
    addTracksToPlaylist,
    addImageToPlaylist
  }
}