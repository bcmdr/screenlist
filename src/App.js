import './App.css';
import AppHeader from './components/AppHeader';
import { useState } from 'react';

function App() {
  const [filter, setFilter] = useState('interested');
  function handleFilterChange(filterName) {
    setFilter(filterName)
  }
  return (
    <div className="App">
      <AppHeader filter={filter} onFilterChange={handleFilterChange}></AppHeader>
    </div>
  );
}

export default App;
