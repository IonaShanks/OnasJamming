const clientId = '51a9cba9b37b4c66b455972237397fa2';
//const redirectURI = 'https://onasjammming.surge.sh/';
const redirectURI = 'http://localhost:3000/';
let accessToken;
let expiresIn;


const spotify = {
  getAccessToken(){
    if (accessToken)
    {
      return accessToken;
    }

    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (urlAccessToken && urlExpiresIn)
    {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    else
    {
      window.location = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectURI}`
    }
  },

  search(term){
    const accessToken = spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}})
      .then(response => {return response.json();})
      .then(jsonResponse =>
        {
          if (!jsonResponse.tracks)
          {
            return [];
          }
          return jsonResponse.tracks.items.map(track => ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              preview_url: track.preview_url
          }))
        })
  },

  savePlaylist(name, trackURIs){
    if (!name || !trackURIs.length)
    {
     return;
    }

    const accessToken = spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
    .then(response => response.json())
    .then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: name})
        }
      )
    })
    .then(response => response.json()).then(jsonResponse => {
      const playlistId = jsonResponse.id;
      return fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        }
      );
    });
  }
}
export default spotify;
