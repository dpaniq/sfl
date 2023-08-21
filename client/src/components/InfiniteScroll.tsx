import {createEffect, createSignal, onCleanup} from 'solid-js';
import {Observable, Subject} from 'rxjs';
import {Show} from 'solid-js';

function InfiniteScroll(props) {
  const [wasTriggered, setWasTriggered] = createSignal<boolean>(false);

  createEffect(() => {
    if (!wasTriggered()) {
      console.log('here');
      setWasTriggered(true);
      props.onLoadMore();
    }

    const observerElem = document.querySelector('[data-inf-scroll]');

    const observable = new Observable((observer) => {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log(
                entry,
                entry.target,
                entry.isIntersecting,
                `Элемент видим на ${entry.intersectionRatio * 100}%`,
              );
              if (entry.intersectionRatio === 1) {
                console.log('FIRST HAS MORE', props.hasMore);
                if (props.hasMore) {
                  console.log('HAS MORE');
                  observer.next();
                } else {
                  console.log('NO HAS MORE');
                }
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

  return (
    <>
      <p>wasTriggered: {wasTriggered() ? 'true' : 'false'}</p>
      <p>hasMore: {props.hasMore ? 'true' : 'false'}</p>
      {props.children}
      <Show when={!props.hasMore}>
        <div>END (no more)</div>
      </Show>
    </>
  );
}

export default InfiniteScroll;
