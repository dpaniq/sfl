import {createEffect, createSignal, onCleanup, Component} from 'solid-js';
import {Observable, Subject} from 'rxjs';
import {Show, ParentProps} from 'solid-js';
import {JSX} from 'solid-js';

interface InfiniteScrollInterface {
  hasMore: boolean;
  observerElem: string;
  loadingMessage?: JSX.Element;
  endMessage?: JSX.Element;
  scrollTreshold?: number;
  onLoadMore: () => any;
}

export const InfiniteScroll: Component<ParentProps<InfiniteScrollInterface>> = (props) => {
  let observerRef: any;
  const [loading, setLoading] = createSignal(false);
  const [wasTriggered, setWasTriggered] = createSignal<boolean>(false);

  // Life cycle hooks

  // onMount(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) {
  //       if (props.hasMore) {
  //         setLoading(true);
  //         props.next();
  //       }
  //     } else {
  //       setLoading(false);
  //     }
  //   });

  //   observer.observe(observerRef);

  //   onCleanup(() => {
  //     observer.unobserve(observerRef);
  //   });
  // });

  createEffect(() => {
    if (!wasTriggered()) {
      setWasTriggered(true);
      props.onLoadMore();
    }

    const observerElem = document.querySelector(props.observerElem);

    const observable = new Observable((observer) => {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio === 1) {
              if (props.hasMore) {
                observer.next();
              }
            }
          });
        },
        {
          root: document.querySelector('#scrollContainer') || null, // элемент, относительно которого отслеживается видимость
          rootMargin: undefined, // '0px 0px -200px 0px', // уменьшим область видимости снизу на 200 пикселей
          threshold: [0.5, 0.75, 1], // Массив пороговых значений видимости
        },
      );

      intersectionObserver.observe(observerElem);

      return () => {
        intersectionObserver.disconnect();
      };
    });

    const subscription = observable.subscribe(() => props.onLoadMore());

    onCleanup(() => {
      subscription.unsubscribe();
      // document.body?.removeChild(observerElem);
    });
  });

  const observerObjectHeight = !props.scrollTreshold ? '50px' : props.scrollTreshold + 'px';

  createEffect(() => {
    if (!props.hasMore) {
      setLoading(false);
    }
  });

  return (
    <>
      <p>wasTriggered: {wasTriggered() ? 'true' : 'false'}</p>
      <p>hasMore: {props.hasMore ? 'true' : 'false'}</p>
      {props.children}
      <div
        ref={observerRef}
        style={{
          height: observerObjectHeight,
          'margin-top': '-' + observerObjectHeight,
          'z-index': '-999',
        }}
      />
      <Show when={loading()} children={props.loadingMessage || <div>Loading...</div>} />
      <Show when={!props.hasMore} children={props.endMessage} />
    </>
  );
};
