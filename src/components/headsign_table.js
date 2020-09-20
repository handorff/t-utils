import React, { useState, useEffect, useMemo } from "react"
import _ from "lodash"

import Table from "../components/table"

const formatHeadsignRows = (data, included) => {
  const includedTrips = included.filter(({ type }) => type === "trip")
  const tripsToHeadsigns = _.fromPairs(
    includedTrips.map(({ id, attributes }) => [id, attributes.headsign])
  )

  const headsignData = data.map(({ id, attributes, relationships }) => {
    const { typicality } = attributes
    const {
      representative_trip: {
        data: { id: representativeTripID },
      },
      route: {
        data: { id: routeID },
      },
    } = relationships
    const headsign = tripsToHeadsigns[representativeTripID]
    return { routePatternID: id, routeID, headsign, typicality }
  })

  headsignData.sort((a, b) => (a.routePatternID > b.routePatternID ? 1 : -1))
  return headsignData
}

const getChildStops = included => {
  if (included) {
    const childStops = included.filter(
      ({ attributes: { location_type: locationType } }) => locationType === 0
    )
    return childStops.map(({ id }) => id)
  } else {
    return []
  }
}

const HeadsignTable = ({ selectedStops }) => {
  const [headsignData, setHeadsignData] = useState()
  const columns = useMemo(
    () => [
      { Header: "Headsign", accessor: "headsign" },
      { Header: "Route ID", accessor: "routeID" },
      { Header: "Route Pattern ID", accessor: "routePatternID" },
      { Header: "Typicality", accessor: "typicality" },
    ],
    []
  )

  useEffect(() => {
    const stopQuery = selectedStops.join(",")

    fetch(
      `https://api-v3.mbta.com/stops?filter[id]=${stopQuery}&filter[location_type]=1&include=child_stops`
    )
      .then(response => response.json())
      .then(({ included }) => getChildStops(included))
      .then(childStops => {
        const stopsWithChildren = [...childStops, ...selectedStops]
        const stopsWithChildrenQuery = stopsWithChildren.join(",")

        fetch(
          `https://api-v3.mbta.com/route_patterns?filter[stop]=${stopsWithChildrenQuery}&include=representative_trip`
        )
          .then(response => response.json())
          .then(({ data, included }) => formatHeadsignRows(data, included))
          .then(headsignData => setHeadsignData(headsignData))
      })
  }, [selectedStops])

  if (headsignData) {
    return <Table data={headsignData} columns={columns} />
  } else {
    return null
  }
}

export default HeadsignTable
