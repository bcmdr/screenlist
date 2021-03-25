import './AppHeader.css'
import LoginControl from './LoginControl'
import classNames from "classnames";

function AppHeader(props) {
  function handleKeyUp(event) {
    if (event.code === 'Enter') {
      document.querySelector('.search-input input').blur()
    }
  }
  return (
    <header className="AppHeader">
      <div className="primary-header">
        <div className="logo">ScreenList</div>
        <LoginControl></LoginControl>
      </div>
      <div className="secondary-header">
        <nav className="menu-left">
          <ul>
            <li 
              className={classNames({
                active: props.filter === "interested"
              })} 
              onClick={() => props.onFilterChange('interested')}>Interested</li>
            <li 
              className={classNames({
                active: props.filter === "seen"
              })} 
              onClick={() => props.onFilterChange('seen')}>Seen</li>
            <li
              className={classNames({
                active: props.filter === "favourites"
              })} 
              onClick={() => props.onFilterChange('favourites')}>Favourites</li>
          </ul>
        </nav>
        <div className="menu-right">
            <div className="search-input">
              <input onFocus={() => props.onFilterChange('search')} placeHolder="Search" onChange={props.onSearchInputChange} onKeyUp={handleKeyUp} autoFocus type="text"></input>
            </div>
          {/* <div
            className={classNames({
              active: props.filter === "search"
            })} 
            onClick={() => props.onFilterChange('search')}>Search</div> */}
        </div>
      </div>
    </header>
  )
}

export default AppHeader;