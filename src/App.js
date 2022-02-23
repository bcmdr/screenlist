import './App.css';
import AppHeader from './components/AppHeader';
import ResultPoster from './components/ResultPoster';
import ResultPreview from './components/ResultPreview';
import { useState, useEffect} from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from "./firebase_config";

function App() {
  const [filter, setFilter] = useState('search');
  const [tmdbConfig, setTmdbConfig] = useState({});
  const [currentResults, setCurrentResults] = useState([]);
  const [userMovies, setUserMovies] = useState({})
  const [sortType, setSortType] = useState("popularity");
  const [previewProviders, setPreviewProviders] = useState([]);
  const [previewSelected, setPreviewSelected] = useState(null)
  const [user, loading] = useAuthState(firebase.auth);

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

  const sortBy = {
    title: (a, b) => {
      if (a.result) { 
        a = a.result;
        b = b.result;
      }

      let nameA = a.name ? a.name : a.title;
      let nameB = b.name ? b.name : b.title;

      return (nameA > nameB) ? 1 : -1;
    },
    newest: (a, b) => {
      if (a.result) { 
        a = a.result;
        b = b.result;
      }
      let releaseDateA = a.release_date ? new Date(a.release_date) : new Date(a.first_air_date);
      let releaseDateB = b.release_date ? new Date(b.release_date) : new Date(b.first_air_date);

      console.log(releaseDateA, releaseDateB);
      return (releaseDateA > releaseDateB) ? -1 : 1;

    },
    popularity: (a, b) => {
      if (a.result) { 
        a = a.result;
        b = b.result;
      }
      if (a.popularity === b.popularity) return 0;
      return (a.popularity > b.popularity) ? -1 : 1;
    }
  };

  useEffect(() => {
    console.log('effect running')
    if (!user) {
      setCurrentResults([]);
      return;
    }
    const collectionRef = firebase.db.collection('users').doc(`${user.uid}`).collection('movies');
    const fetchData = async () => {
      const fetchedData = {}
      const querySnapshot = await collectionRef.get();
      querySnapshot.forEach((doc) => {
        fetchedData[doc.id] = doc.data();
      })
      setUserMovies(fetchedData);
      setCurrentResults(Object.values(fetchedData).filter((value) => value.statuses['interested'] === true));
    };
    fetchData();
  }, [user]);

  const handleFilterChange = (filterName) => {
    setFilter(filterName);
    setPreviewSelected(null);
    if (filterName === "search") {
      setCurrentResults([]);
      let el = document.querySelector('.search input');
      el && el.focus();
      setCurrentResults([]);
      setSortType("popularity");
    } else {
      setCurrentResults(Object.values(userMovies).filter((value) => value.statuses[filterName] === true));
    }
  }

  function handleKeyUp(event) {
    if (event.code === 'Enter') {
      handleSearchInputChangeDebounced(event);
      let el = document.querySelector('.search input');
      el && el.blur()
    }
  }

  async function handleSearchInputChange(event) {
    setPreviewSelected(null);
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=251ba64a492fa521304db43e5fa3d2ad&language=en-US&query=${event.target.value}&page=1&include_adult=false`);
    const data = await response.json();
    setCurrentResults(data.results);
  }

  const handleSearchInputChangeDebounced = AwesomeDebouncePromise(
    handleSearchInputChange, 
    750
  )

  const handleStatusUpdate = async ({result, statusName, currentStatuses}) => {

    if (!user) {
      const googleAuthProvider = new firebase.firebase.auth.GoogleAuthProvider();
      firebase.firebase.auth().signInWithPopup(googleAuthProvider);
      return;
    };

    let newStatuses = { 
      ...currentStatuses,
      [statusName]: !currentStatuses[statusName]
    }

    // Seen when liked
    if (statusName === 'liked' && newStatuses.liked && !newStatuses.seen) {
      newStatuses.seen = true;
    }

    // Not liked if not seen
    if (statusName === 'seen' && !newStatuses.seen && newStatuses.liked) {
      newStatuses.liked = false;
    }

    if ((statusName === 'seen') && newStatuses.seen) {
      newStatuses.interested = false;
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
    setUserMovies(updatedUserMovies);
  }

  const handlePreviewSelect = async (result) => {
    let type = 'movie';
    if (result.media_type === 'tv') type = 'tv';
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${result.id}/watch/providers?api_key=251ba64a492fa521304db43e5fa3d2ad`);
    const data = await response.json();
    setPreviewProviders(data.results?.CA);
    setPreviewSelected(result);
  }

  const handleSignOut = () => {
    setPreviewSelected(null)
    setCurrentResults([]);
    handleFilterChange('search');
  }

  return (
    <div className="App">
      <AppHeader user={user} filter={filter} onFilterChange={handleFilterChange} onSignOut={handleSignOut}></AppHeader>
      {(!user || filter === 'search') && 
        <div className="search width-container">
          <input autoFocus placeholder="Search Movie or TV Titles..." onChange={handleSearchInputChangeDebounced} onKeyUp={handleKeyUp} onFocus={(event) => {event.target.setSelectionRange(0, event.target.value.length)}} type="text"></input>
        </div>
      }
      {previewSelected && 
        <ResultPreview providers={previewProviders} result={previewSelected} imageConfig={tmdbConfig.images} onPreviewClick={() => {setPreviewSelected(null)}}></ResultPreview>
      }
        <main>
          {(currentResults?.length > 0 || filter === "search") &&
            <section className="sort width-container">
              <div>Sort By</div>
              <div className={`sort-option ${sortType === 'popularity' ? "active" : "" }`} onClick={() => setSortType("popularity")}>Popular</div>
              <div className={`sort-option ${(sortType === 'title' || sortType === 'titleInverted') ? "active" : "" }`} onClick={() => setSortType("title")}>Title</div>
              <div className={`sort-option ${(sortType === 'newest' || sortType === 'newestInverted') ? "active" : "" }`} onClick={() => setSortType("newest")}>Newest</div>
            </section>
}
          {(currentResults === undefined || currentResults?.length === 0) && 
              <section className="no-results">
                <h1>Track Your Movies</h1>
                <p><b className="link" onClick={() => handleFilterChange("search")}>Search</b> for Movies and TV Shows to find where they are streaming.</p>
                <p>Sign in to save titles to your <strong>Interested</strong>, <strong>Seen</strong>, and <strong>Liked</strong> lists.</p>
              </section>
            }
          <section className="results width-container">
            {currentResults && [].concat(currentResults).sort(sortBy[sortType]).map((result) => {
              if (result.result) {
                result = result.result;
              }
              return <ResultPoster imageConfig={tmdbConfig.images} result={result} statuses={(userMovies[result.id] && userMovies[result.id].statuses) || {}} key={result.id} user={user} onStatusUpdate={handleStatusUpdate} onPreviewSelect={handlePreviewSelect}></ResultPoster>
            })}
          </section>
      </main>
      <footer className="width-container"><a href="https://www.themoviedb.org/">Powered by <img alt="TMDB" width="50px" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"></img></a></footer>
    </div>
  );
}

export default App;
