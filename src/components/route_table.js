import React, { useState, useMemo, useEffect } from "react"

import Table from "../components/table"

const RouteTable = ({ selectedStops }) => {
  const [routeData, setRouteData] = useState()
  const columns = useMemo(
    () => [
      { Header: "Short Name", accessor: "shortName" },
      { Header: "Long Name", accessor: "longName" },
    ],
    []
  )

  useEffect(() => {
    const stopQuery = selectedStops.join(",")
    fetch(`https://api-v3.mbta.com/routes?filter[stop]=${stopQuery}`)
      .then(response => response.json())
      .then(json => json.data)
      .then(routeArray =>
        routeArray.map(({ attributes }) => {
          const { short_name, long_name } = attributes
          return { shortName: short_name, longName: long_name }
        })
      )
      .then(routeData => setRouteData(routeData))
  }, [selectedStops])

  if (routeData) {
    return <Table data={routeData} columns={columns} />
  } else {
    return null
  }
}

export default RouteTable
