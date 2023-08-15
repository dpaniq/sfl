import {Accessor, createContext, createSignal, useContext} from 'solid-js';

interface StoreInterface {
  counter: {
    value: Accessor<number>;
    increment(): void;
    decrement(): void;
  };
}

// function useProviderValues() {
//   const [isBurgerMenu, setBurgerMenu] = createSignal(false);
//   return {isBurgerMenu, setBurgerMenu};
// }

// https://gist.github.com/JLarky/a46055f673a2cb021db1a34449e3be07

const StoreContext = createContext<StoreInterface>();

export function StoreProvider<StoreInterface>(props) {
  const [count, setCount] = createSignal<number>(props.count || 0),
    counter = {
      value: count,
      increment() {
        setCount((c) => c + 1);
      },
      decrement() {
        setCount((c) => c - 1);
      },
    };

  const values = {
    counter,
  };

  return <StoreContext.Provider value={values}>{props.children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext<StoreInterface>(StoreContext);
}
