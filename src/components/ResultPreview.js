import './ResultPreview.css'

function ResultPreview(props){

  return (
    <section className="ResultPreview"
      style={{
        backgroundImage: `url(${props.imageConfig.secure_base_url}${props.imageConfig.backdrop_sizes[2]}${props.result.backdrop_path})`
      }}>
      
      <div className="info">
        <h3 className="title">{props.result.title}</h3>
        <div className="year">{props.result.release_date.split('-')[0]}</div>
        <div className="overview">
          {props.result.overview}
        </div>
        <div className="providers">
          {props.providers?.flatrate?.map((provider) => {
              return <a href={props.providers?.link}><img className="providers-logo" alt={provider.provider_name} src={`${props.imageConfig.secure_base_url}${props.imageConfig.logo_sizes[0]}${provider.logo_path}`} /></a>
            })}
        </div>
        <div className="hide-preview" onClick={props.onPreviewClick}>
          Hide
        </div>
      </div>
      {/* <img alt={props.result.title} src={`${props.imageConfig.secure_base_url}${props.imageConfig.backdrop_sizes[2]}${props.result.backdrop_path}`}></img> */}
      
    </section>
  )
}

export default ResultPreview;