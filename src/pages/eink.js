import React, { useState } from "react"
import Select from "react-select"
import _ from "lodash"

import RouteTable from "../components/route_table"
import HeadsignTable from "../components/headsign_table"

const EINK_SCREENS = {
  1: { name: "100301 1624 Blue B001", stopID: "1722" },
  2: { name: "100303 Blue Hill Ave B002", stopID: "383" },
  3: { name: "100311 Broadway Nor B003", stopID: "5496" },
  4: { name: "100105 Church Lex B004", stopID: "2134" },
  5: { name: "100313 Eliot Bennett B005", stopID: "32549" },
  6: { name: "100315 Harvard Sq B006", stopID: "22549" },
  7: { name: "100319 Hawthorne B007", stopID: "5615" },
  8: { name: "100302 Hyde Park Oak B008", stopID: "36466" },
  9: { name: "100317 Malcolm X B009", stopID: "11257" },
  10: { name: "100316 Mass Ave Harr B010", stopID: "58" },
  11: { name: "100304 Huntington B011", stopID: "21365" },
  12: { name: "100322 St James Dart B012", stopID: "178" },
  14: { name: "100323 Tremont opp Rox B014", stopID: "1357" },
  15: { name: "100305 Warren Quincy B015", stopID: "390" },
  16: { name: "100306 Warren Towns B016", stopID: "407" },
  17: { name: "100309 Wash Broad B017", stopID: "5605" },
  18: { name: "100308 Wash Firth B018", stopID: "637" },
  19: { name: "100310 Watertown Sq B019", stopID: "8178" },
}

const EInkScreenPicker = ({ setSelectedScreen }) => {
  const options = _.map(EINK_SCREENS, ({ name }, screenID) => {
    return { value: screenID, label: name }
  })

  return <Select options={options} onChange={setSelectedScreen} />
}

const EInkScreenViewer = ({ selectedScreen }) => {
  const { value: screenID } = selectedScreen
  const { stopID } = EINK_SCREENS[screenID]

  if (stopID) {
    return (
      <div>
        <RouteTable selectedStops={[stopID]} />
        <HeadsignTable selectedStops={[stopID]} />
      </div>
    )
  } else {
    return null
  }
}

const EInk = () => {
  const [selectedScreen, setSelectedScreen] = useState()

  return (
    <div>
      <EInkScreenPicker setSelectedScreen={setSelectedScreen} />
      {selectedScreen && <EInkScreenViewer selectedScreen={selectedScreen} />}
    </div>
  )
}

export default EInk
