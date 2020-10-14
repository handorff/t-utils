import React, { useEffect, useState, useMemo } from "react"
import _ from "lodash"

import Table from "../components/table"
import LinkCell from "../components/link_cell"

const prepareStopRows = data => {
  return _.map(
    data,
    ({ id, attributes: { latitude: lat, longitude: long } }) => {
      const link = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
      return { id, lat, long, link }
    }
  )
}

const EntranceTable = ({ selectedStation }) => {
  const [stopData, setStopData] = useState([])

  const columns = useMemo(
    () => [
      { Header: "Stop ID", accessor: "id" },
      { Header: "Latitude", accessor: "lat" },
      { Header: "Longitude", accessor: "long" },
      { Header: "Google Maps Link", accessor: "link", Cell: LinkCell },
    ],
    []
  )

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

  if (stopData) {
    return <Table data={stopData} columns={columns} />
  } else {
    return null
  }
}

export default EntranceTable
