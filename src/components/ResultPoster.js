import './ResultPoster.css'
import classNames from "classnames";

function ResultPoster(props){
  if (!props.result.poster_path) return null;

  return (
    <li className="ResultPoster">
      <img alt={props.result.title} src={`${props.imageConfig.secure_base_url}${props.imageConfig.poster_sizes[3]}${props.result.poster_path}`}></img>
      <div className="info">
        <div className="title">{props.result.title}</div>
        <div className="year">{props.result.release_date.split('-')[0]}</div>
      </div>
      <div className="controls">
        <button 
          className={classNames({
            active: props.statuses.interested
          })} 
          onClick={() => props.onStatusUpdate({result: props.result, statusName:'interested', currentStatuses: props.statuses})}>Interested</button>
        <button 
          className={classNames({
            active: props.statuses.seen
          })} 
          onClick={() => props.onStatusUpdate({result: props.result, statusName:'seen', currentStatuses: props.statuses})}>Seen</button>
        <button 
          className={classNames({
            active: props.statuses.liked
          })} 
          onClick={() => props.onStatusUpdate({result: props.result, statusName:'liked', currentStatuses: props.statuses})}>Liked</button>
      </div>
    </li>
  )
}

export default ResultPoster;