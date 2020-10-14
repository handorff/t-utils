import React, { useState, useEffect } from "react"

import SingleStopPicker from "../components/single_stop_picker"
import EntranceTable from "../components/entrance_table"

const Entrances = () => {
  const [allStations, setAllStations] = useState([])
  const [selectedStation, setSelectedStation] = useState()

  useEffect(() => {
    fetch("https://api-v3.mbta.com/stops?filter[location_type]=1")
      .then(response => response.json())
      .then(json => json.data)
      .then(stopArray =>
        stopArray.map(({ id, attributes }) => {
          const { name } = attributes
          return { value: id, label: `${name} (${id})` }
        })
      )
      .then(stops => setAllStations(stops))
  }, [])

  return (
    <div>
      <SingleStopPicker
        allStops={allStations}
        setSelectedStop={setSelectedStation}
      />
      {selectedStation && <EntranceTable selectedStation={selectedStation} />}
    </div>
  )
}

export default Entrances
