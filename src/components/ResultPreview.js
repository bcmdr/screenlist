import './ResultPreview.css'
import classNames from "classnames";

function ResultPreview(props){

  return (
    <section className="ResultPreview"
      style={{
        backgroundImage: `url(${props.imageConfig.secure_base_url}${props.imageConfig.backdrop_sizes[2]}${props.result.backdrop_path})`
      }}>
      
      <div className="info">
        <div className="width-container">
          <h3 className="title">{props.result.title || props.result.name}</h3>
          <div className="year">{props.result.release_date ? props.result.release_date.split('-')[0] : props.result.first_air_date?.split('-')[0]}</div>
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
          <div className="overview">
            {props.result.overview}
          </div>
          <div className="width-container flex-center" style={{padding: "0", alignItems: "flex-end"}} >
            <div className="providers">
              {props.providers && <div><a target="_blank" href={props.providers?.link} rel="noreferrer">Rent</a> • <a target="_blank" href={props.providers?.link} rel="noreferrer">Buy</a> {props.providers?.flatrate && <span> • <a target="_blank" href={props.providers?.link} rel="noreferrer">Stream</a></span>}</div>}
              {props.providers?.flatrate?.map((provider) => {
                  return <a target="_blank" href={props.providers?.link} rel="noreferrer"><img className="providers-logo" alt={provider.provider_name} src={`${props.imageConfig.secure_base_url}${props.imageConfig.logo_sizes[2]}${provider.logo_path}`} /></a>
                })}
              {!props.providers && <div>Not Available to Stream</div>}
            </div>
            <div className="hide-preview" onClick={props.onPreviewClick}>
              Hide
            </div>
          </div>
        </div>
      </div>
      {/* <img alt={props.result.title} src={`${props.imageConfig.secure_base_url}${props.imageConfig.backdrop_sizes[2]}${props.result.backdrop_path}`}></img> */}
      
    </section>
  )
}

export default ResultPreview;