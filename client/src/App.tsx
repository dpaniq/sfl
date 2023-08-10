import {About as AboutPage} from '@pages/About';
import {Users as UsersPage} from '@pages/Users';
import {Route, Routes} from '@solidjs/router';
import {Home as HomeIcon} from '@suid/icons-material';
import {Button} from '@suid/material';
import {createSignal, lazy, type Component} from 'solid-js';
import styles from './App.module.css';
import {getUsersReq} from './api/users';
import AsideNavigation from './components/Aside';
import BasicTable from './components/UserTable';
import logo from './logo.svg';

const homeIcon = HomeIcon;

// Later
// const Users = lazy(() => import('./pages/Home'));
// const Home = lazy(() => import('./pages/Users'));
const HomePageLazy = lazy(() => import('@pages/Home'));

const App: Component = () => {
  const [users, setUsers] = createSignal<User[]>([]);

  const handleGetUsers = async (event: any) => {
    const usersReq = await getUsersReq();
    console.log(event, usersReq);
    setUsers((prev) => [...prev, ...usersReq]);
  };

  return (
    <>
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
          <Button variant="contained">Hello world</Button>;
          <button onClick={handleGetUsers}>Click and see</button>
        </header>

        <AsideNavigation />

        <main>
          <Routes>
            <Route path="/users" component={UsersPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/home" component={HomePageLazy} />
            <Route path="/" component={HomePageLazy} />
          </Routes>
          <BasicTable />
        </main>

        <footer></footer>
      </div>
    </>
  );
};

export default App;
