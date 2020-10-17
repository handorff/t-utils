import React, { useEffect, useState } from "react"
import _ from "lodash"
import { Map, TileLayer, Marker, Tooltip } from "react-leaflet"

const prepareStopRows = data => {
  return _.map(
    data,
    ({ id, attributes: { latitude: lat, longitude: long } }) => {
      return { id, lat, long }
    }
  )
}

const EntranceMap = ({ selectedStation }) => {
  const [stopData, setStopData] = useState([])
  const [position, setPosition] = useState()

  useEffect(() => {
    fetch(
      `https://api-v3.mbta.com/stops/${selectedStation}?include=child_stops`
    )
      .then(response => response.json())
      .then(json => json.included)
      .then(childStops =>
        _.filter(
          childStops,
          ({ attributes: { location_type: locationType } }) =>
            locationType === 2
        )
      )
      .then(prepareStopRows)
      .then(setStopData)
  }, [selectedStation])

  useEffect(() => {
    if (stopData && stopData.length > 0) {
      const lats = _.map(stopData, ({ lat }) => lat)
      const longs = _.map(stopData, ({ long }) => long)

      const minLat = _.min(lats)
      const maxLat = _.max(lats)
      const centerLat = (minLat + maxLat) / 2

      const minLong = _.min(longs)
      const maxLong = _.max(longs)
      const centerLong = (minLong + maxLong) / 2

      setPosition([centerLat, centerLong])
    }
  }, [stopData])

  if (typeof window !== "undefined" && position) {
    return (
      <Map
        center={position}
        zoom={18}
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {stopData.map(({ id, lat, long }) => (
          <Marker position={[lat, long]} key={id}>
            <Tooltip>{id}</Tooltip>
          </Marker>
        ))}
      </Map>
    )
  }

  return null
}

export default EntranceMap
