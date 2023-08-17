import InfiniteScroll from 'solid-infinite-scroll';
import {JSX, createResource, createSignal, type Component} from 'solid-js';
import BasicTable from '../components/UserTable';
import {TableCell, TableRow} from '@suid/material';
// const handleSearchInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
//   console.log(event.currentTarget.value);
// };
// import listJSON from '../api/list.json';

// const listPromise = new Promise<{data: IPlayer[]; count: number}>(function (resolve, reject) {
//   setTimeout(function () {
//     resolve(listJSON);
//   }, 200);
// });

// const fetchApi = async () => await (await fetch('https://api.example.com/list')).json();
// const fetchApi = async () => listPromise;
const fetchApi = async (): Promise<{data: IPlayer[]; count: number}> => {
  console.log('FETCH API FOR PLAYERS');
  const x = await (await fetch('mock/list.json')).json();
  console.log((x as any)?.count);
  return x;
};

const listNumber = 5;

// https://libraries.io/npm/solid-infinite-scroll

export default function Players<Component>({number}) {
  const [api] = createResource(fetchApi);

  const [scrollIndex, setScrollIndex] = createSignal(listNumber);
  const scrollNext = () => setScrollIndex(Math.min(scrollIndex() + listNumber, api()?.data.length));

  const [searchString, setSearchString] = createSignal('');

  const handleSearchInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    console.log(event.currentTarget.value);
    setSearchString(event.currentTarget.value);
  };

  return (
    <section class="players">
      <br />
      <pre>
        scrollIndex: {scrollIndex()}; hasMore={scrollIndex() < api()?.count}
      </pre>
      <hr />

      <hr />
      <br />
      <input
        placeholder="Search players..."
        class="players-input"
        type="text"
        onInput={handleSearchInput}
        value={searchString()}
      />
      <BasicTable searchString={searchString}>
        <InfiniteScroll
          each={api()?.data.slice(0, scrollIndex())}
          hasMore={scrollIndex() < api()?.count}
          next={scrollNext}
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
      </BasicTable>
    </section>
  );
}
