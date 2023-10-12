import React from "react";
import { ShrinkToFitWidth } from "./shrink-to-fit-width";

describe("ShrinkToFitWidth", () => {
  it("renders", () => {
    cy.mount(<ShrinkToFitWidthExample />);
    [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "+ 5 more",
    ].forEach((s) => {
      cy.findByText(s).should("exist");
    });
  });

  it("reacts to changes in width", () => {
    cy.mount(<ShrinkToFitWidthExample />);

    // Decreasing to a really small width such that no counts work
    // should render the component with a "null" count, which it can choose how to render.
    cy.findByLabelText("Width").type("{selectall}").type("20");
    cy.findByText("No fit!").should("exist");

    // A slightly larger size is not big enough for any state names but enough to summarize
    cy.findByLabelText("Width").type("{selectall}").type("100");
    cy.findByText("10 states").should("exist");

    // With a little more space it will show a couple state names
    cy.findByLabelText("Width").type("{selectall}").type("200");
    ["Alabama", "Alaska", "+ 8 more"].forEach((s) => {
      cy.findByText(s).should("exist");
    });
  });

  it("reacts to changes in count", () => {
    cy.mount(<ShrinkToFitWidthExample />);

    // When the count is increased, more states are relegated to the "more" count
    cy.findByLabelText("Count").type("{selectall}").type("50");
    [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "+ 45 more",
    ].forEach((s) => {
      cy.findByText(s).should("exist");
    });

    cy.findByLabelText("Count").type("{selectall}").type("0");
    cy.findByText("0 states").should("exist");

    cy.findByLabelText("Count").type("{selectall}").type("3");
    ["Alabama", "Alaska", "Arizona"].forEach((s) => {
      cy.findByText(s).should("exist");
    });
  });

  it("reacts to changes in gap", () => {
    cy.mount(<ShrinkToFitWidthExample />);

    // Increasing the gap should push one of the states into the "more" count
    cy.findByLabelText("Gap").type("{selectall}").type("20");
    [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "+ 6 more",
    ].forEach((s) => {
      cy.findByText(s).should("exist");
    });
  });
});

const ShrinkToFitWidthExample = () => {
  const [numberOfStates, setNumberOfStates] = React.useState(10);
  const [width, setWidth] = React.useState(400);
  const [gap, setGap] = React.useState(4);
  const [fontSize, setFontSize] = React.useState(16);

  return (
    <div>
      <label>
        {"Count"}
        <input
          type="number"
          max={50}
          min={0}
          value={numberOfStates}
          onChange={(e) => setNumberOfStates(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        {"Width"}
        <input
          type="number"
          max={500}
          min={0}
          step={5}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        {"Gap"}
        <input
          type="number"
          max={50}
          min={0}
          value={gap}
          onChange={(e) => setGap(Number(e.target.value))}
        />
      </label>
      <hr />
      <label>
        {"Font size"}
        <input
          type="number"
          max={22}
          min={4}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </label>
      <hr />
      <div style={{ background: "#eee", width }}>
        <ShrinkToFitWidth maxCount={numberOfStates} maxWidth={width}>
          {({ ref, count }) => (
            <ExampleContent
              ref={ref}
              count={numberOfStates}
              visibleCount={count}
              gap={gap}
              fontSize={fontSize}
            />
          )}
        </ShrinkToFitWidth>
      </div>
    </div>
  );
};

interface ExampleContentProps {
  count: number;
  visibleCount: number | null;
  gap: number;
  fontSize: number;
}

const ExampleContent = React.forwardRef<HTMLDivElement, ExampleContentProps>(
  ({ count, visibleCount, gap, fontSize }, ref) => {
    if (visibleCount === null) return <span>{"No fit!"}</span>;

    const includedStateNames = stateNames.slice(0, count);
    const visibleStateNames = includedStateNames.slice(0, visibleCount);
    const hiddenStateNamesCount = count - visibleCount;
    return (
      <div
        style={{ display: "inline-flex", gap, whiteSpace: "nowrap", fontSize }}
        ref={ref}
      >
        {visibleCount === 0 && <span>{`${count} states`}</span>}
        {visibleStateNames.map((s) => (
          <span key={s}>{s}</span>
        ))}
        {hiddenStateNamesCount > 0 && visibleCount > 0 && (
          <span>{`+ ${hiddenStateNamesCount} more`}</span>
        )}
      </div>
    );
  }
);

ExampleContent.displayName = "ExampleContent";

const stateNames = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
