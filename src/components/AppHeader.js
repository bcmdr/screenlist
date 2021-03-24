import './AppHeader.css'
import LoginControl from './LoginControl'
import classNames from "classnames";

function AppHeader(props) {
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
        <nav className="menu-right">
          <ul>
          <li
              className={classNames({
                active: props.filter === "search"
              })} 
              onClick={() => props.onFilterChange('search')}>Search</li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default AppHeader;