import {JSX, createEffect, createSignal, onCleanup} from 'solid-js';
import InfiniteScroll from '../components/InfiniteScroll';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@suid/material';
import {getPlayersList} from '../api/players';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {createStore} from 'solid-js/store';
export default function Home<Component>({number}) {
  // RxJS
  // const searchQuery_ = new BehaviorSubject<string | null>(null);
  // const searchQuery$ = searchQuery_.asObservable();
  // const unsubscribe_ = new Subject<void>();

  // createEffect(() => {
  //   searchQuery$.pipe(takeUntil(unsubscribe_)).subscribe((text) => {
  //     setItems([])
  //   });

  //   onCleanup(() => {
  //     unsubscribe_.next();
  //     unsubscribe_.complete();
  //   });
  // });
  const [searchQuery, setSearchQuery] = createSignal('');
  const [store, setStore] = createStore<{
    total: number;
    items: IPlayer[];
  }>({
    total: 0,
    items: [],
  });

  // Signals
  // TODO it seems to be extra

  // callback
  const loadMoreItems = async () => {
    console.log('loadMoreItems was triggered:');

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
    console.log({pastSearchQuery, actualSearchQuery: searchQuery()});
    if (pastSearchQuery != searchQuery()) {
      console.log('Новое значение', searchQuery());
      setStore({total: 0, items: []});
      loadMoreItems();
    }

    // onCleanup(() => {
    //   console.log('ON CLEAN UP EXECUTION', items().length);
    // });

    return searchQuery().trim();
  }, searchQuery());

  return (
    <section class="players">
      <h1>Players page:</h1>
      <p>
        Displayed {store.items?.length}/{store.total}
      </p>
      <p>hasMore: {store.items.length < store.total ? 'Y' : 'N'}</p>
      {/* <p>store: {JSON.stringify(store, null, 2)}</p> */}
      {/* <p>items: {JSON.stringify(items(), null, 2)}</p> */}
      {/* <p>lastApi: {JSON.stringify(lastRequest(), null, 2)}</p> */}
      {/* <Show when={api.loading}>
        <button>LOADING:::::</button>
      </Show> */}
      <input
        placeholder="Search players..."
        class="players-input"
        type="text"
        // onInput={handleSearchInput}
        // onInput={(event) => searchQuery_.next(event.currentTarget.value)}
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
              observerElem={'data-inf-scroll'}
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
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea rerum veritatis dolor
      necessitatibus, corporis labore tempore laborum pariatur quam ab amet iure sed, debitis facere
      harum corrupti fugiat quae voluptatum vel nobis, voluptatem ipsa tenetur quas minus? Vero
      ducimus officiis dolorem ex non assumenda minima numquam accusamus, blanditiis enim,
      laboriosam itaque et architecto voluptates! Vero quidem distinctio alias doloribus,
      necessitatibus ab dolore optio, praesentium laudantium deleniti minus non minima possimus rem,
      nostrum iusto enim! Repudiandae ad deleniti provident molestias quas accusantium officia
      quidem voluptatibus nemo odio cum molestiae qui libero, nobis excepturi quia, labore dolorum
      consectetur magnam iste doloribus. Quisquam aliquam, sapiente quos perferendis deleniti
      laboriosam magni dignissimos deserunt est blanditiis ratione saepe minus. Ullam incidunt
      provident nam fuga dignissimos at harum animi, molestias corporis aliquam voluptates, numquam
      voluptatem necessitatibus, distinctio unde eos officia aspernatur autem placeat. Eligendi
      soluta sit autem doloribus suscipit pariatur aliquam accusamus. Mollitia vel repellendus
      numquam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi dignissimos, quod
      nisi nostrum molestias, veniam dolor reiciendis error facilis animi architecto possimus,
      necessitatibus ut recusandae aspernatur natus autem eligendi. Voluptatem debitis, in facere
      assumenda numquam doloribus dolorem voluptates ut harum odio a facilis, rerum reiciendis est
      nesciunt atque blanditiis dolores veniam! Culpa qui aliquid hic accusamus iure quibusdam
      placeat, sit porro sint quis officiis maiores modi explicabo ab aspernatur, odit beatae,
      dolore totam doloribus ipsa id soluta non libero dolor? Praesentium, sapiente! Minima enim
      cupiditate facilis? Tenetur adipisci magnam porro nemo ad, incidunt ut, ducimus vero, non
      recusandae sequi? Adipisci veritatis in reprehenderit placeat pariatur, nobis doloribus
      tempore. Dolores tempora voluptate vitae animi natus quae aliquid molestiae fugiat a ullam!
      Autem sit reprehenderit temporibus quaerat, aspernatur natus neque quos illum blanditiis
      repudiandae laborum quam expedita alias quibusdam recusandae incidunt nulla non eaque, numquam
      ad, sapiente veritatis reiciendis. Fugit, doloremque corporis! Totam odit ducimus quis
      corporis soluta placeat labore fugiat, saepe nobis, incidunt ipsum quo omnis doloremque harum?
      Placeat velit quod, aperiam minus eum, architecto eos corrupti quidem totam, natus rerum error
      beatae quasi id ad neque consequatur! Labore, iure maxime dolorum, nemo dicta voluptate quam
      quas vero distinctio adipisci ut.
    </section>
  );
}
