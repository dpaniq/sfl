import {About as AboutPage} from '@pages/About';
import {Route, Routes} from '@solidjs/router';
import {Home as HomeIcon} from '@suid/icons-material';
import {Button} from '@suid/material';
import {createSignal, lazy, type Component} from 'solid-js';
import {getUsersReq} from './api/users';
import AsideNavigation from './components/Aside';
import {useStore} from './context/store';

const homeIcon = HomeIcon;

// Later
// const Users = lazy(() => import('./pages/Home'));
// const Home = lazy(() => import('./pages/Users'));
const HomePageLazy = lazy(() => import('@pages/Home'));
const PlayersPageLazy = lazy(() => import('@pages/Players'));

const App: Component = () => {
  const [users, setUsers] = createSignal<User[]>([]);
  const {counter} = useStore();

  const handleGetUsers = async (event: any) => {
    const usersReq = await getUsersReq();
    console.log(event, usersReq);
    setUsers((prev) => [...prev, ...usersReq]);
  };

  return (
    <>
      <header>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a href="https://github.com/solidjs/solid" target="_blank" rel="noopener noreferrer">
          Learn Solid
        </a>
        <Button variant="contained">Hello world</Button>;
        <button onClick={handleGetUsers}>Click and see</button>
      </header>

      <AsideNavigation />

      <main>
        <Routes>
          <Route path="/about" component={AboutPage} />
          <Route path="/players" component={PlayersPageLazy} />
          <Route path="/home" component={HomePageLazy} />
          <Route path="/" component={HomePageLazy} />
        </Routes>
      </main>

      <footer></footer>
    </>
  );
};

export default App;
