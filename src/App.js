import './App.css';
import AppHeader from './components/AppHeader';
import ResultPoster from './components/ResultPoster';
import ResultPreview from './components/ResultPreview';
import { useState, useEffect} from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from "./firebase_config";

function App() {
  const [filter, setFilter] = useState('interested');
  const [tmdbConfig, setTmdbConfig] = useState({});
  const [currentResults, setCurrentResults] = useState([]);
  const [userMovies, setUserMovies] = useState({})
  const [previewSelected, setPreviewSelected] = useState(null)
  const [user, loading, error] = useAuthState(firebase.auth);

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

  useEffect(() => {
    if(!user) return;
    const collectionRef = firebase.db.collection('users').doc(`${user.uid}`).collection('movies');
    const fetchData = async () => {
      const fetchedData = {}
      const querySnapshot = await collectionRef.get();
      querySnapshot.forEach((doc) => {
        fetchedData[doc.id] = doc.data();
      })
      console.log(fetchedData)
      setUserMovies(fetchedData);
      setCurrentResults(Object.values(fetchedData).filter((value) => value.statuses.interested === true));
    };
    fetchData();
  }, [user]);

  const handleFilterChange = (filterName) => {
    setFilter(filterName);
    setPreviewSelected(null);
    if (filterName === "search") {
      let el = document.querySelector('.search input');
      el && el.focus();
      setCurrentResults([]);
    } else {
      setCurrentResults(Object.values(userMovies).filter((value) => value.statuses[filterName] === true));
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
    setCurrentResults(data.results);
  }

  const handleSearchInputChangeDebounced = AwesomeDebouncePromise(
    handleSearchInputChange, 
    750
  )

  const handleStatusUpdate = ({result, statusName, currentStatuses}) => {
    let newStatuses = { 
      ...currentStatuses,
      [statusName]: !currentStatuses[statusName]
    }

    // Seen when liked
    if (statusName === 'liked' && newStatuses.liked && !newStatuses.seen) {
      newStatuses.seen = true;
    }

    if (statusName === 'seen' && !newStatuses.seen && newStatuses.liked) {
      newStatuses.liked = false;
    }

    let movieRef = firebase.db.collection(`users/${user.uid}/movies`).doc(`${result.id}`);
    const newUserMovie = {
      result,
      statuses: newStatuses
    }
    // Update Firestore
    movieRef.set(newUserMovie, {merge: true});

    // Update Local State
    let updatedUserMovies = {...userMovies}
    updatedUserMovies[result.id] = newUserMovie;
    setUserMovies(updatedUserMovies)
  }

  const handlePreviewSelect = (result) => {
    setPreviewSelected(result);
  }

  return (
    <div className="App">
      <AppHeader filter={filter} onFilterChange={handleFilterChange}></AppHeader>
      {filter === 'search' && 
        <div className="search">
          <input autoFocus placeholder="Search movie titles..." onChange={handleSearchInputChangeDebounced} onKeyUp={handleKeyUp} onFocus={(event) => {event.target.setSelectionRange(0, event.target.value.length)}} type="text"></input>
        </div>
      }
      {previewSelected && 
        <ResultPreview result={previewSelected} imageConfig={tmdbConfig.images} onPreviewClick={() => {setPreviewSelected(null)}}></ResultPreview>
      }
        <main>
          <section className="results">
            {currentResults && currentResults.map((result) => {
              if (result.result) {
                result = result.result;
              }
              return <ResultPoster imageConfig={tmdbConfig.images} result={result} statuses={(userMovies[result.id] && userMovies[result.id].statuses) || {}} key={result.id} user={user} onStatusUpdate={handleStatusUpdate} onPreviewSelect={handlePreviewSelect}></ResultPoster>
            })}
          </section>
      </main>
    </div>
  );
}

export default App;
