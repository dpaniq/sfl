import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import Tables from './shared/Tables'

export function App() {

  return (
    <>
      <section id="tables">
        <Tables></Tables>
      </section>
    </>
  )
}
