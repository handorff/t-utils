import React from "react"
import { Link } from "gatsby"

const Home = () => {
  return (
    <div>
      <div>
        <Link to="/stops">Routes and Headsigns at Stops</Link>
      </div>
      <div>
        <Link to="/eink">Bus e-Ink sign locations</Link>
      </div>
    </div>
  )
}

export default Home
