import './ResultPoster.css'

function ResultPoster(props){
  if (!props.result.poster_path) return null;
  return (
    <li class="ResultPoster">
      <img alt={props.result.title} src={`${props.imageConfig.secure_base_url}${props.imageConfig.poster_sizes[2]}${props.result.poster_path}`}></img>
      <div className="info">
        <div className="title">{props.result.title}</div>
        <div className="year">{props.result.release_date.split('-')[0]}</div>
      </div>
      <div className="controls">
        <button>Interested</button>
        <button>Seen</button>
        <button>Favourite</button>
      </div>
    </li>
  )
}

export default ResultPoster;