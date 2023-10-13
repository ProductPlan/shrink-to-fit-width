import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useReducer,
  MutableRefObject,
} from "react";
import { useUpdateEffect } from "usehooks-ts";

export interface ShrinkToFitWidthProps<T> {
  maxCount: number;
  maxWidth: number;
  children(data: {
    ref: MutableRefObject<T>;
    count: number | null;
  }): JSX.Element;
}

// The state is we're either actively figuring out the count, there is no valid count, or we know the count.
type ShrinkState = "computing" | null | number;

/**
 * Say you have a component that can show N things, but you may want to only render some X < N, width permitting.
 * Wrap your component with ShrinkToFitWidth and provide the max count (how many things you could show given no width restriction)
 * and max width (how wide the rendered component can be). It will find and render the largest count that can fit,
 * or a fallback if nothing fits. Once rendered it will react to changes in available with, available count, and changes in width
 * of the rendered element. For example, if available space increases, it will automatically rerender your component with a larger
 * count to fill the available space. If you rerender your component and it's now wider, the count may be decreased to stay
 * within the maximum width.
 */
export function ShrinkToFitWidth<T extends HTMLDivElement>({
  maxCount,
  maxWidth,
  children,
}: ShrinkToFitWidthProps<T>) {
  const [shrinkState, setShrinkState] = useState<ShrinkState>("computing");
  const recomputeCount = React.useCallback(
    () => void setShrinkState("computing"),
    []
  );
  const setNoFit = React.useCallback(() => void setShrinkState(null), []);

  if (shrinkState === "computing")
    return (
      <ShrinkingToFitWidth
        maxCount={maxCount}
        maxWidth={maxWidth}
        onFit={setShrinkState}
        onNoFit={setNoFit}
      >
        {children}
      </ShrinkingToFitWidth>
    );

  return (
    <ShrunkToFitWidth
      maxCount={maxCount}
      maxWidth={maxWidth}
      count={shrinkState}
      onCountInvalidation={recomputeCount}
    >
      {children}
    </ShrunkToFitWidth>
  );
}

interface ShrinkingToFitWidthProps<T> {
  maxCount: number;
  maxWidth: number;
  children(data: { ref: MutableRefObject<T>; count: number }): JSX.Element;
  onFit(count: number): void;
  onNoFit(): void;
}

// Renders the component at strategic counts to find the largest count that fits within the max width.
// The largest count is reported via the onFit callback. If there is no count that satisfies the max width
// requirement, the onNoFit callback is invoked.
// See https://en.wikipedia.org/wiki/Binary_search_algorithm#Procedure_for_finding_the_rightmost_element.
function ShrinkingToFitWidth<T extends HTMLElement>({
  maxCount,
  maxWidth,
  children,
  onFit,
  onNoFit,
}: ShrinkingToFitWidthProps<T>) {
  const ref = useRef<T>();
  const upperBound = useRef(maxCount + 1); // Exclusive bound
  const lowerBound = useRef(0); // Inclusive bound

  // Unlike a traditional binary search, start with the max count.
  // This is slightly worse in the general case, but much faster when
  // the max count renders within the max width, which is likely a common case.
  const [count, setCount] = useState(maxCount);
  const [rerenders, rerender] = useReducer((x) => x + 1, 0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();

    // If the width did not register, rerender the component.
    if (width === 0 && count > 1) {
      rerender();
      return;
    }

    if (width > maxWidth) {
      upperBound.current = count;
    } else {
      lowerBound.current = count + 1;
    }

    // Once the bounds have been brought together, the largest count is the one just inside the upper bound
    if (lowerBound.current >= upperBound.current) {
      if (upperBound.current === 0) {
        onNoFit();
      } else {
        onFit(upperBound.current - 1);
      }

      return;
    }

    // Render the midpoint between the bounds
    const nextCount = Math.floor((lowerBound.current + upperBound.current) / 2);
    setCount(nextCount);
  }, [count, maxWidth, rerenders, onFit, onNoFit]);

  return children({ ref, count });
}

interface ShrunkToFitWidthProps<T> {
  maxCount: number;
  maxWidth: number;
  children(data: { ref: MutableRefObject<T>; count: number }): JSX.Element;
  count: number | null;
  onCountInvalidation(): void;
}

// Once we have determined the optimal count, we render it in the "shrunk" state.
// This simply renders the component at the optimal count and listens for any changes
// that may require the count to be recomputed.
function ShrunkToFitWidth<T extends HTMLElement>({
  maxCount,
  maxWidth,
  children,
  count,
  onCountInvalidation,
}: ShrunkToFitWidthProps<T>) {
  const ref = useRef<T>();

  // If the width changes for whatever reason, we need to recompute the count.
  useWidthChangeObserver(ref.current, () => {
    onCountInvalidation();
  });

  // If the max count or max width changes, we need to recompute the count.
  useUpdateEffect(() => {
    onCountInvalidation();
  }, [maxCount, maxWidth]);

  return children({ ref, count });
}

// Subscribe to width changes to an element
function useWidthChangeObserver(
  element: HTMLElement,
  onWidthChange: () => void
) {
  const originalWidth = useMemo(
    () => element?.getBoundingClientRect().width ?? 0,
    [element]
  );
  const checkResizeForWidthChange = useCallback(() => {
    const observedWidth = element.getBoundingClientRect().width;
    if (observedWidth !== originalWidth) onWidthChange();
  }, [element, originalWidth, onWidthChange]);
  useResizeObserver(element, checkResizeForWidthChange);
}

// Subscribe to resizes for an element
function useResizeObserver(
  element: HTMLElement,
  callback: ResizeObserverCallback
) {
  const resizeObserver = useMemo(
    () => new ResizeObserver(callback),
    [callback]
  );
  useEffect(() => {
    if (element) resizeObserver.observe(element);
    return () => {
      if (element) resizeObserver.unobserve(element);
    };
  }, [element, resizeObserver]);
}
