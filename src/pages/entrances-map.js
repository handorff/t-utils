import React, { useState, useEffect } from "react"
import _ from "lodash"

import SingleStopPicker from "../components/single_stop_picker"
import EntranceMap from "../components/entrance_map"

const filterChildlessStations = json => {
  const entranceIdList = _.chain(json.included)
    .filter(
      ({ attributes: { location_type: locationType } }) => locationType === 2
    )
    .map(({ id }) => id)
    .value()

  const entranceIdSet = new Set(entranceIdList)

  return _.filter(
    json.data,
    ({
      relationships: {
        child_stops: { data: childStops },
      },
    }) => _.some(childStops, ({ id }) => entranceIdSet.has(id))
  )
}

const Entrances = () => {
  const [allStations, setAllStations] = useState([])
  const [selectedStation, setSelectedStation] = useState()
  const [mapVisible, setMapVisible] = useState(true)

  const hideMap = () => setMapVisible(false)

  useEffect(() => {
    fetch(
      "https://api-v3.mbta.com/stops?filter[location_type]=1&include=child_stops"
    )
      .then(response => response.json())
      .then(filterChildlessStations)
      .then(stopArray =>
        stopArray.map(({ id, attributes }) => {
          const { name } = attributes
          return { value: id, label: `${name} (${id})` }
        })
      )
      .then(stops => setAllStations(stops))
  }, [])

  useEffect(() => {
    setMapVisible(true)
  }, [selectedStation])

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "46px auto",
      }}
    >
      <div
        onClick={hideMap}
        onKeyDown={hideMap}
        onTouchStart={hideMap}
        style={{ margin: "8px" }}
      >
        <SingleStopPicker
          allStops={allStations}
          setSelectedStop={setSelectedStation}
        />
      </div>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          margin: "8px",
        }}
      >
        {selectedStation && mapVisible && (
          <EntranceMap selectedStation={selectedStation} />
        )}
      </div>
    </div>
  )
}

export default Entrances
