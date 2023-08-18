import {
  Paper,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@suid/material';
import InfiniteScroll from 'solid-infinite-scroll';
import {
  Accessor,
  For,
  createSignal,
  Component,
  ParentComponent,
  children,
  createResource,
  createEffect,
  Show,
} from 'solid-js';
import {getPlayersList} from '../api/players';

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

const fetchApiMock = async ({
  take,
  skip,
  searchQuery,
}: {
  take: number;
  skip: number;
  searchQuery?: string;
}): Promise<{data: IPlayer[]; count: number}> => {
  console.log('FETCH API FOR PLAYERS');
  const x = await (await fetch('mock/list.json')).json();
  console.log((x as any)?.count);
  return x;
};

const fetchApi = async ({
  take,
  skip,
  searchQuery,
}: {
  take: number;
  skip: number;
  searchQuery?: string;
}): Promise<{data: IPlayer[]; count: number}> => {
  console.log('FETCH API FOR PLAYERS', take, skip, searchQuery);
  const x = await (await fetch('mock/list.json')).json();
  console.log((x as any)?.count);
  return x;
};

const listNumber = 50;

// https://stackoverflow.com/questions/76299871/solidjs-how-to-trigger-createeffect-to-update-a-signal-from-createresource
export default function BasicTable({searchQuery}: {searchQuery?: Accessor<string>}) {
  const [scrollIndex, setScrollIndex] = createSignal(listNumber);

  const [apiArguments, setApiArguments] = createSignal({
    take: listNumber,
    skip: 0,
    searchQuery: searchQuery(),
  });

  const [api] = createResource(apiArguments, getPlayersList);

  // const scrollNext = () => setScrollIndex(Math.min(scrollIndex() + listNumber, api()?.data.length));
  const scrollNext = () => {
    console.log('scrollNext Called');
    setApiArguments((prev) => ({
      ...prev,
      skip: prev.skip + listNumber,
    }));
  };

  const [rows$, setRows$] = createSignal<IPlayer[]>([]);
  const filteredRows$ = () => {
    console.log('filteredRows');
    if (!rows$().length) {
      return rows$();
    }
    return !searchQuery() ? rows$() : rows$().filter((row) => row.name.match(searchQuery()));
  };

  createEffect((totalRows: number) => {
    console.log('createEffect Called');
    const data = api()?.data;
    // debugger;
    if (data) {
      // setScrollIndex(totalScrollIndex);
      setRows$((prev) => [...prev, ...data]);
      // setScrollIndex(Math.min(scrollIndex() + listNumber, totalRows));
      setScrollIndex(rows$().length);
    }
    console.log(api()?.data);
    // setRows$((prev) => [...prev, ...api().data]);
    return totalRows + listNumber;
  }, 0);

  const TableRowEnd = (
    <TableRow class="players-infinite-table--end-row">
      <TableCell colspan="6" align="center">
        END
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Show when={api.loading}>
        <button>LOADING:::::</button>
      </Show>
      <p>ScrollIndex:{scrollIndex()}</p>
      <p>Rows:{rows$().length}</p>
      <em>SearchString: {searchQuery()}</em>
      <em>apiArguments: {JSON.stringify(apiArguments())}</em>

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
            <InfiniteScroll
              each={filteredRows$()}
              hasMore={scrollIndex() < api()?.count}
              next={scrollNext}
              // scrollTreshold={200}
              loadingMessage={'WAS BUDET EWE'}
              endMessage={TableRowEnd}
            >
              {(row, index) => (
                <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.nickname}</TableCell>
                  <TableCell align="right">{row.surname}</TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                </TableRow>
              )}
            </InfiniteScroll>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
