import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"

const Home = () => {
  return (
    <Layout>
      <div>
        <div>
          <Link to="/stops">Routes and Headsigns at Stops</Link>
        </div>
        <div>
          <Link to="/schedule">First and Last Scheduled Stops</Link>
        </div>
        <div>
          <Link to="/eink">Bus e-Ink sign locations</Link>
        </div>
        <div>
          <Link to="/entrances-table">Station entrances (table)</Link>
        </div>
        <div>
          <Link to="/entrances-map">Station entrances (map)</Link>
        </div>
      </div>
    </Layout>
  )
}

export default Home
