import InfiniteScroll from 'solid-infinite-scroll';
import {JSX, createResource, createSignal} from 'solid-js';
import BasicTable from '../components/UserTable';
// const handleSearchInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
//   console.log(event.currentTarget.value);
// };

const fetchApi = async () => await (await fetch('https://api.example.com/list')).json();
// https://libraries.io/npm/solid-infinite-scroll
export default function Players<Component>({number}) {
  const [api] = createResource(fetchApi);

  const [scrollIndex, setScrollIndex] = createSignal(5);
  const scrollNext = () => setScrollIndex(Math.min(scrollIndex() + 50, api().length));

  const [searchString, setSearchString] = createSignal('');

  const handleSearchInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    console.log(event.currentTarget.value);
    setSearchString(event.currentTarget.value);
  };

  return (
    <section class="players">
      <InfiniteScroll
        each={api()?.slice(0, scrollIndex())}
        hasMore={scrollIndex() < api()?.length}
        next={scrollNext}
      >
        {(item, index) => <div>{(item as any)?.nickname}</div>}
      </InfiniteScroll>

      <input
        placeholder="Search players..."
        class="players-input"
        type="text"
        onInput={handleSearchInput}
        value={searchString()}
      />
      <BasicTable searchString={searchString} />
    </section>
  );
}
