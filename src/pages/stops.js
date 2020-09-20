import React, { useState, useEffect } from "react"

import StopPicker from "../components/stop_picker"
import RouteTable from "../components/route_table"
import HeadsignTable from "../components/headsign_table"

const Stops = () => {
  const [allStops, setAllStops] = useState([])
  const [selectedStops, setSelectedStops] = useState([])

  useEffect(() => {
    fetch("https://api-v3.mbta.com/stops?filter[location_type]=0,1")
      .then(response => response.json())
      .then(json => json.data)
      .then(stopArray =>
        stopArray.map(({ id, attributes }) => {
          const { name } = attributes
          return { value: id, label: `${name} (${id})` }
        })
      )
      .then(stops => setAllStops(stops))
  }, [])

  return (
    <div>
      <StopPicker allStops={allStops} setSelectedStops={setSelectedStops} />
      {selectedStops.length > 0 && <RouteTable selectedStops={selectedStops} />}
      {selectedStops.length > 0 && (
        <HeadsignTable selectedStops={selectedStops} />
      )}
    </div>
  )
}

export default Stops
