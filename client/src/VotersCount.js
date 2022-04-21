import React from "react";


function VotersCount(props) {

  const votersCount = props.votersCount;

  const renderVotersCount = () => <p>{votersCount} registered {votersCount > 1 ? "voters" : "voter"}</p>

  return (
    renderVotersCount(votersCount)
  )

}

export default VotersCount;