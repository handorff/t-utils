import React from "react"
import Select, { createFilter } from "react-select"

const SingleStopPicker = ({ allStops, setSelectedStop }) => {
  const onChange = ({ value, label }) => {
    setSelectedStop(value)
  }

  return (
    <Select
      options={allStops}
      onChange={onChange}
      filterOption={createFilter({ ignoreAccents: false })}
    />
  )
}

export default SingleStopPicker
