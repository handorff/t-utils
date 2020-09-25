import React, { useEffect, useState, useMemo } from "react"
import _ from "lodash"

import Table from "../components/table"

const prepareScheduleRows = data => {
  const groups = _.groupBy(
    data,
    ({
      relationships: {
        route: {
          data: { id: routeID },
        },
      },
    }) => routeID
  )

  const rows = _.map(groups, (schedules, routeID) => {
    schedules = _.filter(
      schedules,
      ({ attributes: { departure_time: departureTime } }) =>
        departureTime !== null
    )

    if (schedules.length === 0) {
      return null
    }

    const min = _.minBy(
      schedules,
      ({ attributes: { departure_time: departureTime } }) => departureTime
    ).attributes.departure_time
    const max = _.maxBy(
      schedules,
      ({ attributes: { departure_time: departureTime } }) => departureTime
    ).attributes.departure_time
    return { route: routeID, earliest: min, latest: max }
  })

  return _.filter(rows, row => row !== null)
}

const ScheduleTable = ({ selectedStop, selectedDate }) => {
  const [scheduleData, setScheduleData] = useState([])

  const columns = useMemo(
    () => [
      { Header: "Route", accessor: "route" },
      { Header: "Earliest", accessor: "earliest" },
      { Header: "Latest", accessor: "latest" },
    ],
    []
  )

  const dateString = selectedDate.toISOString().split("T")[0]
  useEffect(() => {
    fetch(
      `https://api-v3.mbta.com/schedules?filter[stop]=${selectedStop}&date=${dateString}`
    )
      .then(response => response.json())
      .then(json => json.data)
      .then(prepareScheduleRows)
      .then(setScheduleData)
  }, [selectedStop, dateString])

  if (scheduleData) {
    return <Table data={scheduleData} columns={columns} />
  } else {
    return null
  }
}

export default ScheduleTable
