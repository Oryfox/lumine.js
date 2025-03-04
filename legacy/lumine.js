#!/usr/bin/env node

import fs from 'fs';
import open from 'open';
import http from 'http'
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom'

const playlistUrl = process.argv[2];

let spotifyToken;
let user;

var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent('d85da33f849c462b9249819b933e7723');
url += '&scope=' + encodeURIComponent('playlist-modify-private user-read-private');
url += '&redirect_uri=' + encodeURIComponent('http://localhost:8080/callback');

open(url);

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    req.on('data', (chunk) => {
      spotifyToken = chunk.toString()
      printUserInfo()
    })
    res.end('ok')
    server.close()
  }
  if (req.method === 'GET') {
    res.end(fs.readFileSync('index.html', 'utf8'))
  }
})
server.listen(8080)

const printUserInfo = () => {
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + spotifyToken,
    }
  }).then(async response => {
    user = await response.json()

    console.log(`Logged in as ${user.display_name}`);

    getPlaylist()
  })
}

const getPlaylist = () => {
  fetch(playlistUrl).then(async res => {
    parseDom(await res.text())
  })
}

const parseDom = (data) => {
  const dom = new JSDOM(data);

  uploadPlaylist(JSON.parse(dom.window.document.getElementById('serialized-server-data').textContent))
}

const uploadPlaylist = async (playlist) => {
  const tracks = playlist[0].data.sections[1]

  const response = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + spotifyToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: playlist[0].data.sections[0].items[0].title,
      public: false,
    })
  })

  if (response.status !== 201) {
    console.error('Failed to create playlist')
    return
  }

  const playlistData = await response.json()

  const spotifyIds = []
  for (let i = 0; i < tracks.items.length; i++) {
    const track = tracks.items[i]

    const title = track.title
    const artist = track.subtitleLinks[0].title
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(title + ' ' + artist)}&type=track&limit=1`, {
      headers: {
        Authorization: 'Bearer ' + spotifyToken,
      }
    })

    const data = await res.json()

    try {
      spotifyIds.push(data.tracks.items[0].id)
    } catch { }
  }

  console.log(`Found ${spotifyIds.length} tracks`);

  const chunks = []
  for (let i = 0; i < spotifyIds.length; i += 100) {
    chunks.push(spotifyIds.slice(i, i + 100))
  }

  for (let i = 0; i < chunks.length; i++) {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + spotifyToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: chunks[i].map(id => `spotify:track:${id}`)
      })
    })

    if (res.status !== 200) {
      console.error('Failed to add tracks')
      return
    }

    console.log('Finished uploading playlist');
    process.exit(0)
  }
}