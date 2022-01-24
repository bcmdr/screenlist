import './AppHeader.css'
import LoginControl from './LoginControl'
import classNames from "classnames";

function AppHeader(props) {
  return (
    <>
      <header className="primary-header">
        <div className="logo" onClick={() => props.onFilterChange('interested')}>ScreenList</div>
        <LoginControl></LoginControl>
      </header>
      {(!props.user || props.filter === "search") && <div class="header-buffer"></div>}
      {props.user &&
        <header className="secondary-header">
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
                  active: props.filter === "liked"
                })} 
                onClick={() => props.onFilterChange('liked')}>Liked</li>
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
        </header>
      }
    </>
  )
}

export default AppHeader;