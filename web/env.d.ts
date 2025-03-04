/// <reference types="vite/client" />

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyUser {
  country: string,
  display_name: string,
  explicit_content: {
    filter_enabled: boolean,
    filter_locked: boolean
  },
  external_urls: {
    spotify: string
  },
  followers: {
    total: number
  },
  href: string,
  id: string,
  images: SpotifyImage[],
  product: string,
  type: string,
  uri: string
}

interface SpotifyImage {
  height: number,
  url: string,
  width: number,
}

interface SpotifyTrack {
  album:       SpotifyAlbum;
  artists:     SpotifyArtist[];
  duration_ms: number;
  id:          string;
  name:        string;
  uri:         string;
  selected?:   boolean;
}

interface SpotifyAlbum {
  images: SpotifyImage[];
}

interface SpotifyArtist {
  name: string;
}

interface AppleMusicPlaylist {
  data: APData;
}

 interface APData {
  sections: APSection[];
}

 interface APSection {
  items: APItem[];
}

 interface APItem {
  artistName?:                  string;
  artwork:                      APArtwork;
  modalPresentationDescriptor?: APModalPresentationDescriptor;
  title?:                       string;
  trackNumber?:                 null;
  duration?:                    number;
  selected?:                    boolean;
}

 interface APArtwork {
  dictionary: APDictionary;
}

 interface APDictionary {
  width:       number;
  height:      number;
  url:         string;
  textColor3?: string;
  textColor2?: string;
  textColor4?: string;
  textColor1?: string;
  bgColor?:    string;
}

 interface APModalPresentationDescriptor {
  headerTitle:    string;
  headerSubtitle: string;
  paragraphText:  string;
}

