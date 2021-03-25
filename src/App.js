import './App.css';
import AppHeader from './components/AppHeader';
import ResultPoster from './components/ResultPoster'
import { useState, useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise'

function App() {
  const [filter, setFilter] = useState('interested');
  const [tmdbConfig, setTmdbConfig] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://api.themoviedb.org/3/configuration?api_key=251ba64a492fa521304db43e5fa3d2ad',
      );
      const data = await response.json();
      console.log(data);
      setTmdbConfig(data);
    };
 
    fetchData();
  }, []);

  function handleFilterChange(filterName) {
    setFilter(filterName)
    if (filterName !== "search") {
      document.querySelector('.search-input input').value = "";
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
      <AppHeader filter={filter} onSearchInputChange={handleSearchInputChangeDebounced} onFilterChange={handleFilterChange}></AppHeader>
      <main>
        {searchResults && searchResults.map((result) => {
          return <ResultPoster imageConfig={tmdbConfig.images} result={result} key={result.id}></ResultPoster>
        })}
      </main>
    </div>
  );
}

export default App;
