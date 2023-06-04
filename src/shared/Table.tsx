import { useState, useEffect } from 'preact/hooks'
import { getStatsByYear } from '../utils/stats'
import { FC } from 'preact/compat'

export default function Table({ year }) {

  const [stats, setStats] = useState([])

  useEffect(() => {
    if (year) {
      getStatsByYear(year).then((d) => {
        console.log({ d })
        setStats(d)
      }).catch()
    }

  }, [year])

  console.log(year, stats)

  return (
    <>
      <h1>Statistics for {year}</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Games:</th>
            <th>Goals:</th>
            <th>Passes:</th>
            <th>Points:</th>
            <th>Score:</th>
            <th>MVP:</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(row => (
            <tr>
              <td>{row.name}</td>
              <td>{row.games}</td>
              <td>{row.goals}</td>
              <td>{row.passes}</td>
              <td>{row.points}</td>
              <td>{row.totalScore}</td>
              <td>{row.totalMVP}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}