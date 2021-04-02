import './ResultPreview.css'

function ResultPreview(props){

  return (
    <section className="ResultPreview" onClick={props.onPreviewClick}
      style={{
        backgroundImage: `url(${props.imageConfig.secure_base_url}${props.imageConfig.backdrop_sizes[2]}${props.result.backdrop_path})`
      }}>
      <div className="hide-preview">
        Hide
      </div>
      <div className="info">
        <h3 className="title">{props.result.title}</h3>
        <div className="year">{props.result.release_date.split('-')[0]}</div>
        <div className="overview">
          {props.result.overview}
        </div>
      </div>
      {/* <img alt={props.result.title} src={`${props.imageConfig.secure_base_url}${props.imageConfig.backdrop_sizes[2]}${props.result.backdrop_path}`}></img> */}
      
    </section>)
}

export default ResultPreview;