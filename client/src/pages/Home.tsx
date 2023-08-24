import {JSX, createEffect, createSignal, onCleanup} from 'solid-js';
import {InfiniteScroll} from '../components/InfiniteScroll';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@suid/material';
import {getPlayersList} from '../api/players';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {createStore} from 'solid-js/store';
export default function Home<Component>({number}) {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [store, setStore] = createStore<{
    total: number;
    items: IPlayer[];
  }>({
    total: 0,
    items: [],
  });

  // callback
  const loadMoreItems = async () => {
    const d = await getPlayersList({
      take: 10,
      skip: store.items.length,
      searchQuery: searchQuery(),
    });
    setStore((prev) => ({
      ...prev,
      total: d.count,
      items: [...prev.items, ...d.data],
    }));
  };

  createEffect((pastSearchQuery) => {
    if (pastSearchQuery != searchQuery()) {
      setStore({total: 0, items: []});
      loadMoreItems();
    }

    // Life cycle hooks
    onCleanup(() => {});

    return searchQuery().trim();
  }, searchQuery());

  return (
    <section class="players">
      <h1>Players page:</h1>
      <p>
        Displayed {store.items?.length}/{store.total}
      </p>

      <input
        placeholder="Search players..."
        class="players-input"
        type="text"
        onInput={({currentTarget}) => setSearchQuery(currentTarget.value)}
      />

      <TableContainer>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
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
              onLoadMore={loadMoreItems}
              hasMore={store.items.length < store.total}
              observerElem={'[data-inf-scroll]'}
            >
              {store.items.map((row, index) => (
                <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.nickname}</TableCell>
                  <TableCell align="right">{row.surname}</TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                </TableRow>
              ))}
            </InfiniteScroll>

            <TableRow data-inf-scroll class="players-infinite-table--end-row">
              <TableCell colspan="7" align="center">
                <em>END</em>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
