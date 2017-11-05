import React from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchResults from '../SearchResults/SearchResults';
import SearchBar from '../SearchBar/SearchBar';
import spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    let shouldAdd = true;
    this.state.playlistTracks.forEach((playlistTrack) => {
      if (track.id === playlistTrack.id)
      {
        shouldAdd = false;
      }
    });

    if (shouldAdd)
    {
      let playlistTracks = this.state.playlistTracks;
      playlistTracks.push(track);
      this.setState({
        playlistTracks: playlistTracks
      });
    }
  }

  removeTrack(track){
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    });
  }

  updatePlaylistName(name){
    this.setState({
      playlistName: name
    })
  }

  savePlaylist(){
    let toSave = this.state.playlistTracks.map(track => track.uri);
    spotify.savePlaylist(this.state.playlistName, toSave);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search(term){
    spotify.search(term).then(searchResults => {
            this.setState({
                searchResults: searchResults
            });
        });
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch = {this.search} />
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={ this.savePlaylist }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
