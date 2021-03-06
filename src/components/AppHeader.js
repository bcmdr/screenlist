import './AppHeader.css'
import LoginControl from './LoginControl'
import classNames from "classnames";

function AppHeader(props) {
  return (
    <>
      <header className="primary-header">
        <div className = "width-container flex-center">
          <div className="header-group">
            <div className="logo"><a href="/">ScreenList</a></div>
            <div className="locale">
                <select name="locale" id="locale" onChange={props.onLocaleChange} value={props.locale}>
                  {props.localeOptions.map((localeOption) => {
                    return <option value={localeOption.iso_3166_1} key={localeOption.iso_3166_1}>{localeOption.native_name}</option>
                  })}
                </select>
              </div>
          </div>
          <LoginControl onSignOut={props.onSignOut}></LoginControl>
        </div>
      </header>
      {(!props.user || props.filter === "search") && <div className="header-buffer"></div>}
      {props.user &&
        <header className="secondary-header">
          <div className="width-container flex-center">
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
          </div>
        </header>
      }
    </>
  )
}

export default AppHeader;