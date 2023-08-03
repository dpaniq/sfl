import { Component, createSignal } from "solid-js";

// export type ITable<T> = {
//   Thead: IThead<T>
//   Tbody: ITbody<T>
// // }

// const Table: Component<ITable> = ({
//   Thead,
//   Tbody
// }) => {
const Table: Component = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>1</th>
          <th>2</th>
          <th>3</th>
          <th>4</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
        </tr>
      </tbody>
    </table>
  )
}


export default Table;
