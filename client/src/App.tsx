import {createSignal, type Component} from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import {getUsersReq} from './api/users';

const App: Component = () => {
  const [users, setUsers] = createSignal<User[]>([]);


  const handleGetUsers = async (event: any) => {
    const usersReq = await getUsersReq();
    console.log(event, usersReq);
    setUsers([...users(), ...usersReq]);
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
        <button onClick={handleGetUsers}>Click and see</button>
      </header>

      <main>
        <table>
          <thead>
            <tr>
              <th>1</th>
              <th>1</th>
              <th>1</th>
              <th>1</th>
              <th>1</th>const user
            </tr>
          </thead>
        </table>
      </main>

      <footer></footer>
    </div>
  );
};

export default App;
