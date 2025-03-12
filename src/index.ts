import {
  type RefObject, useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

// from usehooks-ts
// 当 rollup 打包的时候，他会连同 lodash 的 debounce 部分代码一同打包出来
// 实际上根本没用到 useDebounceValue 这个 hook
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R,
): (...args: Args) => R
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined {
  const ref = useRef<typeof fn>(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })

  useIsomorphicLayoutEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args: Args) => ref.current?.(...args), [ref]) as (
    ...args: Args
  ) => R
}

export type UseResizeObserverOptions = {
  enable?: boolean;
  debug?: boolean;
  onChange?: (entry: ResizeObserverEntry, times: number) => void;
};

export function useResizeObserver<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  { enable = true, debug: isDebug, onChange }: UseResizeObserverOptions = {},
) {
  const [canObserver, setCanObserver] = useState(false);
  const observerRef = useRef<ResizeObserver | undefined>(undefined);
  const timesRef = useRef(0);
  const onChangeCallback = useEventCallback(onChange);

  useIsomorphicLayoutEffect(() => {
    if (observerRef.current != null || elementRef?.current == null) return;
    setCanObserver(enable);
  }, [elementRef, enable]);

  useIsomorphicLayoutEffect(() => {
    if (!canObserver || !enable || elementRef?.current == null) return;
    if (observerRef.current == null) {
      timesRef.current = 0; // rewind
      observerRef.current = new ResizeObserver((entries) => {
        isDebug && console.log('ResizeObserver entries', entries);
        for (const entry of entries) {
          onChangeCallback?.(entry, timesRef.current++);
        }
      });
      observerRef.current.observe(elementRef?.current);
      isDebug && console.log('ResizeObserver.observe');
    }

    return () => {
      if (observerRef.current != null) {
        if (elementRef?.current != null) {
          observerRef.current.unobserve(elementRef?.current);
        }
        observerRef.current.disconnect();
        observerRef.current = undefined;
        setCanObserver(false);
        isDebug && console.log('ResizeObserver.unobserve');
      }
    };
  }, [canObserver, enable]);
}

