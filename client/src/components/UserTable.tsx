import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@suid/material';
import {Accessor, For, createSignal, Component, ParentComponent, children} from 'solid-js';

type Row = {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
};

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return {name, calories, fat, carbs, protein};
}

const rows: Row[] = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gromov Bogdan', 356, 16.0, 49, 3.9),
  createData('Violeta Sineva', 356, 16.0, 49, 3.9),
];

// export default function BasicTable({searchString}: {searchString?: Accessor<string>}) {
export default function BasicTable<ParentComponent>({children, searchString}) {
  const [rows$, setRows$] = createSignal<Row[]>(rows);
  // const filteredRows$ = () => rows$().filter((row) => row.name.match(searchString()));
  const filteredRows$ = () => rows$();

  return (
    <>
      <br />
      {/* <em>SearchString: {searchString()}</em> */}
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Nickname</TableCell>
              <TableCell align="right">Surname</TableCell>
              <TableCell align="right">Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children}
            {/* <For each={filteredRows$()}>
              {(row, i) => (
                <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              )}
            </For> */}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
