You want to render some things but want to change how it displays based on available width.
`ShrinkToFitWidth` will find the optimal way to utilize the available width:

![Example gif](./shrink-to-fit-width-example.gif)

You provide a max width and a max count (how many things you would display given no width restriction).
Then you show how to render your component for some particular `count`.
It will try rendering your component with different values for `count`, but only paint the
one that uses the most available width.

```tsx
<ShrinkToFitWidth maxWidth={500} maxCount={numberOfThings}>
  {({ ref, count }) => (
    <YourComponent ref={ref} numToDisplay={count} />
  )}
</ShrinkToFitWidth>
```

If your component rerenders at a different width, the algorithm will automatically recompute the count.
A change to the max width or the max count will also recompute the count.

To run tests:
```
yarn test
```

To open cypress and interact with the example and tests:
```
yarn run cypress open
```
