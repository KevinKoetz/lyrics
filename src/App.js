import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

class App extends React.Component {
  state = {
    artist: null,
    title: null,
  };

  render() {
    return (
      <div className="App">
        <h1>Lyrics.ovh</h1>
        <p>Only the Lyrics</p>
        <SearchBar
          onSongSelect={(artist, title) => this.setState({ artist, title })}
        />
        {this.state.artist && this.state.title ? (
          <Lyrics artist={this.state.artist} title={this.state.title} />
        ) : null}
      </div>
    );
  }
}

const createDebouncer = () => {
  let timeout = null;
  return (callback) => {
    if(timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback()
      clearTimeout(timeout);
  }, 500)
  }
}

const debounce = createDebouncer()

function SearchBar({ onSongSelect }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(()=>debounce(async ()=>{
    if(!searchInput) return
    const url = `https://api.lyrics.ovh/suggest/${searchInput}`;
    const response = await axios.get(url);
    const firstTen = response.data.data.slice(0, 10);
    setSuggestions(firstTen);
  }), [searchInput])


  const handleSongSelect = (artist, title) => {
    onSongSelect(artist, title);
    setSearchInput("");
    setSuggestions([]);
  };

  return (
    <section>
      <div>
        <input
          type="text"
          placeholder="Type the song you want the lyrics"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <ul className="suggestions">
        {suggestions.map((song) => (
          <li
            key={song.id}
            onClick={() => handleSongSelect(song.artist.name, song.title)}
          >
            {song.title} - {song.artist.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Lyrics({ artist, title }) {
  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    axios.get(url).then((response) => setLyrics(response.data.lyrics));
  }, [artist, title]);
  return (
    <section>
      <h2>{artist} - {title}</h2>
      <p>{lyrics}</p>
    </section>
  );
}

export default App;
