import {JSX, createSignal} from 'solid-js';
import BasicTable from '../components/UserTable';

// const handleSearchInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
//   console.log(event.currentTarget.value);
// };

export default function Players<Component>({number}) {
  const [searchString, setSearchString] = createSignal('');

  const handleSearchInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    console.log(event.currentTarget.value);
    setSearchString(event.currentTarget.value);
  };

  return (
    <section class="players">
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
