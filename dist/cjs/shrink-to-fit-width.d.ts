import React, { MutableRefObject } from "react";
export interface ShrinkToFitWidthProps<T> {
    maxCount: number;
    maxWidth: number;
    children(data: {
        ref: MutableRefObject<T>;
        count: number | null;
    }): JSX.Element;
}
/**
 * Say you have a component that can show N things, but you may want to only render some X < N, width permitting.
 * Wrap your component with ShrinkToFitWidth and provide the max count (how many things you could show given no width restriction)
 * and max width (how wide the rendered component can be). It will find and render the largest count that can fit,
 * or a fallback if nothing fits. Once rendered it will react to changes in available with, available count, and changes in width
 * of the rendered element. For example, if available space increases, it will automatically rerender your component with a larger
 * count to fill the available space. If you rerender your component and it's now wider, the count may be decreased to stay
 * within the maximum width.
 */
export declare function ShrinkToFitWidth<T extends HTMLDivElement>({ maxCount, maxWidth, children, }: ShrinkToFitWidthProps<T>): React.JSX.Element;
