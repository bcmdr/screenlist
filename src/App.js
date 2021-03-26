import './App.css';
import AppHeader from './components/AppHeader';
import ResultPoster from './components/ResultPoster'
import { useState, useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer
} from "@react-firebase/auth";
import firebase from "firebase";
import firebaseConfig from "./firebase_config";

function App() {
  const [filter, setFilter] = useState('interested');
  const [tmdbConfig, setTmdbConfig] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  console.log(firebaseConfig);
  console.log(firebase);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://api.themoviedb.org/3/configuration?api_key=251ba64a492fa521304db43e5fa3d2ad',
      );
      const data = await response.json();
      setTmdbConfig(data);
    };
 
    fetchData();
  }, []);

  function handleFilterChange(filterName) {
    setFilter(filterName)
    if (filterName === "search") {
      let el = document.querySelector('.search input');
      el && el.focus();
    }
  }

  function handleKeyUp(event) {
    if (event.code === 'Enter') {
      let el = document.querySelector('.search input');
      el && el.blur()
    }
  }

  async function handleSearchInputChange(event) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=251ba64a492fa521304db43e5fa3d2ad&language=en-US&query=${event.target.value}&page=1&include_adult=false`);
    const data = await response.json();
    setSearchResults(data.results);
    console.log(searchResults);
  }

  const handleSearchInputChangeDebounced = AwesomeDebouncePromise(
    handleSearchInputChange, 
    750
  )

  return (
    <div className="App">
      <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
        <AppHeader filter={filter} onFilterChange={handleFilterChange}></AppHeader>
        <main>
          {filter === 'search' && 
            <div className="search">
              <input autoFocus placeholder="Search movie titles..." onChange={handleSearchInputChangeDebounced} onKeyUp={handleKeyUp} onFocus={(event) => {event.target.setSelectionRange(0, event.target.value.length)}} type="text"></input>
            </div>
          }
          <section className="results">
            {searchResults && searchResults.map((result) => {
              return <ResultPoster imageConfig={tmdbConfig.images} result={result} key={result.id}></ResultPoster>
            })}
          </section>
        </main>
      </FirebaseAuthProvider>
    </div>
  );
}

export default App;
