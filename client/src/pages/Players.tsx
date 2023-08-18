import InfiniteScroll from 'solid-infinite-scroll';
import {JSX, createResource, createSignal, type Component} from 'solid-js';
import PlayersInfiniteTable from '../components/PlayersInfiniteTable';
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

// https://libraries.io/npm/solid-infinite-scroll

export default function Players<Component>({number}) {
  const [searchQuery, setSearchQuery] = createSignal('');

  const handleSearchInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    console.log(event.currentTarget.value);
    setSearchQuery(event.currentTarget.value);
  };

  return (
    <section class="players">
      <input
        placeholder="Search players..."
        class="players-input"
        type="text"
        onInput={handleSearchInput}
        value={searchQuery()}
      />
      <PlayersInfiniteTable searchQuery={searchQuery} />
    </section>
  );
}
