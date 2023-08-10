import {A} from '@solidjs/router';
import {Home, Info, PersonSearch} from '@suid/icons-material';
import {Component} from 'solid-js';

const AsideNavigation: Component = () => {
  return (
    <aside>
      <nav class="">
        <A href="/home">{Home} Home</A>
        <A href="/users">{PersonSearch} Users</A>
        <A href="/about">{Info} About</A>
      </nav>
    </aside>
  );
};

export default AsideNavigation;
