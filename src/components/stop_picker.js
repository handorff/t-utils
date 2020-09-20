import React, { useState, useMemo, useEffect } from "react"
import Select, { createFilter } from "react-select"
import _ from "lodash"

const StopPicker = ({ allStops, setSelectedStops }) => {
  const [value, setValue] = useState(null)
  const [inputValue, setInputValue] = useState("")

  const allStopsById = useMemo(
    () =>
      _.fromPairs(
        allStops.map(stop => {
          const { value } = stop
          return [value, stop]
        })
      ),
    [allStops]
  )

  const onPaste = e => {
    const pastedText = e.clipboardData.getData("Text")
    const pastedIds = pastedText.split(",").map(s => s.trim())
    const pastedValues = pastedIds
      .map(id => allStopsById[id])
      .filter(v => v !== undefined)
    setValue(value => [...(value || []), ...pastedValues])
  }

  useEffect(() => {
    if (value) {
      setSelectedStops(value.map(({ value }) => value))
    } else {
      setSelectedStops([])
    }
  }, [value, setSelectedStops])

  const onChange = newValue => {
    setValue(newValue)
  }

  const onInputChange = newInputValue => {
    setInputValue(newInputValue)
  }

  if (allStops.length > 0) {
    return (
      <div onPaste={onPaste}>
        <Select
          value={value}
          inputValue={inputValue}
          onChange={onChange}
          onInputChange={onInputChange}
          isMulti
          name="stops"
          options={allStops}
          className="basic-multi-select"
          classNamePrefix="select"
          filterOption={createFilter({ ignoreAccents: false })}
        />
      </div>
    )
  } else {
    return <div>loading stop data...</div>
  }
}

export default StopPicker
