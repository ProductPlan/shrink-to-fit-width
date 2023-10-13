"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShrinkToFitWidth = void 0;
const react_1 = __importStar(require("react"));
const usehooks_ts_1 = require("usehooks-ts");
const resize_observer_1 = require("@juggle/resize-observer");
/**
 * Say you have a component that can show N things, but you may want to only render some X < N, width permitting.
 * Wrap your component with ShrinkToFitWidth and provide the max count (how many things you could show given no width restriction)
 * and max width (how wide the rendered component can be). It will find and render the largest count that can fit,
 * or a fallback if nothing fits. Once rendered it will react to changes in available with, available count, and changes in width
 * of the rendered element. For example, if available space increases, it will automatically rerender your component with a larger
 * count to fill the available space. If you rerender your component and it's now wider, the count may be decreased to stay
 * within the maximum width.
 */
function ShrinkToFitWidth({ maxCount, maxWidth, children, }) {
    const [shrinkState, setShrinkState] = (0, react_1.useState)("computing");
    const recomputeCount = react_1.default.useCallback(() => void setShrinkState("computing"), []);
    const setNoFit = react_1.default.useCallback(() => void setShrinkState(null), []);
    if (shrinkState === "computing")
        return (react_1.default.createElement(ShrinkingToFitWidth, { maxCount: maxCount, maxWidth: maxWidth, onFit: setShrinkState, onNoFit: setNoFit }, children));
    return (react_1.default.createElement(ShrunkToFitWidth, { maxCount: maxCount, maxWidth: maxWidth, count: shrinkState, onCountInvalidation: recomputeCount }, children));
}
exports.ShrinkToFitWidth = ShrinkToFitWidth;
// Renders the component at strategic counts to find the largest count that fits within the max width.
// The largest count is reported via the onFit callback. If there is no count that satisfies the max width
// requirement, the onNoFit callback is invoked.
// See https://en.wikipedia.org/wiki/Binary_search_algorithm#Procedure_for_finding_the_rightmost_element.
function ShrinkingToFitWidth({ maxCount, maxWidth, children, onFit, onNoFit, }) {
    const ref = (0, react_1.useRef)();
    const upperBound = (0, react_1.useRef)(maxCount + 1); // Exclusive bound
    const lowerBound = (0, react_1.useRef)(0); // Inclusive bound
    // Unlike a traditional binary search, start with the max count.
    // This is slightly worse in the general case, but much faster when
    // the max count renders within the max width, which is likely a common case.
    const [count, setCount] = (0, react_1.useState)(maxCount);
    const [rerenders, rerender] = (0, react_1.useReducer)((x) => x + 1, 0);
    (0, react_1.useLayoutEffect)(() => {
        if (!ref.current)
            return;
        const { width } = ref.current.getBoundingClientRect();
        // If the width did not register, rerender the component.
        if (width === 0 && count > 1) {
            rerender();
            return;
        }
        if (width > maxWidth) {
            upperBound.current = count;
        }
        else {
            lowerBound.current = count + 1;
        }
        // Once the bounds have been brought together, the largest count is the one just inside the upper bound
        if (lowerBound.current >= upperBound.current) {
            if (upperBound.current === 0) {
                onNoFit();
            }
            else {
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
// Once we have determined the optimal count, we render it in the "shrunk" state.
// This simply renders the component at the optimal count and listens for any changes
// that may require the count to be recomputed.
function ShrunkToFitWidth({ maxCount, maxWidth, children, count, onCountInvalidation, }) {
    const ref = (0, react_1.useRef)();
    // If the width changes for whatever reason, we need to recompute the count.
    useWidthChangeObserver(ref.current, () => {
        onCountInvalidation();
    });
    // If the max count or max width changes, we need to recompute the count.
    (0, usehooks_ts_1.useUpdateEffect)(() => {
        onCountInvalidation();
    }, [maxCount, maxWidth]);
    return children({ ref, count });
}
// Subscribe to width changes to an element
function useWidthChangeObserver(element, onWidthChange) {
    const originalWidth = (0, react_1.useMemo)(() => { var _a; return (_a = element === null || element === void 0 ? void 0 : element.getBoundingClientRect().width) !== null && _a !== void 0 ? _a : 0; }, [element]);
    const checkResizeForWidthChange = (0, react_1.useCallback)(() => {
        const observedWidth = element.getBoundingClientRect().width;
        if (observedWidth !== originalWidth)
            onWidthChange();
    }, [element, originalWidth, onWidthChange]);
    useResizeObserver(element, checkResizeForWidthChange);
}
// Subscribe to resizes for an element
function useResizeObserver(element, callback) {
    const resizeObserver = (0, react_1.useMemo)(() => { var _a; return new ((_a = window.ResizeObserver) !== null && _a !== void 0 ? _a : resize_observer_1.ResizeObserver)(callback); }, [callback]);
    (0, react_1.useEffect)(() => {
        if (element)
            resizeObserver.observe(element);
        return () => {
            if (element)
                resizeObserver.unobserve(element);
        };
    }, [element, resizeObserver]);
}
