import { Component, createSignal } from "solid-js";

type ITable = {
  // Thead = 
}

const Table: Component<ITable> = ({
  THead,
  TBody
}) => {
  return (
    <table>
      {THead}
      {TBody}
    </table>
  )
}


export default Table;
