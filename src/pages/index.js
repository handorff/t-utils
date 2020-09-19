import React, { useState, useEffect, useMemo } from "react"
import Select, { createFilter } from "react-select"
import { useTable } from "react-table"
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

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 3px red",
                  background: "aliceblue",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                      background: "papayawhip",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

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

export default function Home() {
  const [allStops, setAllStops] = useState([])
  const [selectedStops, setSelectedStops] = useState([])

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
    <>
      <StopPicker allStops={allStops} setSelectedStops={setSelectedStops} />
      {selectedStops.length > 0 && <RouteTable selectedStops={selectedStops} />}
      {selectedStops.length > 0 && (
        <HeadsignTable selectedStops={selectedStops} />
      )}
    </>
  )
}
