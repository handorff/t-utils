import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import SingleStopPicker from "../components/single_stop_picker"
import ScheduleTable from "../components/schedule_table"

const Schedule = () => {
  const [allStops, setAllStops] = useState([])
  const [selectedStop, setSelectedStop] = useState()
  const [selectedDate, setSelectedDate] = useState(new Date())

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
      <DatePicker selected={selectedDate} onChange={setSelectedDate} />
      <SingleStopPicker allStops={allStops} setSelectedStop={setSelectedStop} />
      {selectedStop && (
        <ScheduleTable
          selectedStop={selectedStop}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}

export default Schedule
