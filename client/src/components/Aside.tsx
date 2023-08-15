import {A} from '@solidjs/router';
import {Home, Info, PersonSearch} from '@suid/icons-material';
import {Component} from 'solid-js';

const AsideNavigation: Component = () => {
  return (
    <aside>
      <nav class="">
        <A href="/home">
          <Home class="nav-icon" /> Home
        </A>
        <A href="/players">
          <PersonSearch class="nav-icon" /> Players
        </A>
        <A href="/about">
          <Info class="nav-icon" /> About
        </A>
      </nav>
    </aside>
  );
};

export default AsideNavigation;
