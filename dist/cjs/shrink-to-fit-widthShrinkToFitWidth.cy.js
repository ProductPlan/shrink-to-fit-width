"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const shrink_to_fit_width_1 = require("./shrink-to-fit-width");
describe("ShrinkToFitWidth", () => {
    it("renders", () => {
        cy.mount((0, jsx_runtime_1.jsx)(ShrinkToFitWidthExample, {}));
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
        cy.mount((0, jsx_runtime_1.jsx)(ShrinkToFitWidthExample, {}));
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
        cy.mount((0, jsx_runtime_1.jsx)(ShrinkToFitWidthExample, {}));
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
        cy.mount((0, jsx_runtime_1.jsx)(ShrinkToFitWidthExample, {}));
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
    const [numberOfStates, setNumberOfStates] = react_1.default.useState(10);
    const [width, setWidth] = react_1.default.useState(400);
    const [gap, setGap] = react_1.default.useState(4);
    const [fontSize, setFontSize] = react_1.default.useState(16);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { children: ["Count", (0, jsx_runtime_1.jsx)("input", { type: "number", max: 50, min: 0, value: numberOfStates, onChange: (e) => setNumberOfStates(Number(e.target.value)) })] }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsxs)("label", { children: ["Width", (0, jsx_runtime_1.jsx)("input", { type: "number", max: 500, min: 0, step: 5, value: width, onChange: (e) => setWidth(Number(e.target.value)) })] }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsxs)("label", { children: ["Gap", (0, jsx_runtime_1.jsx)("input", { type: "number", max: 50, min: 0, value: gap, onChange: (e) => setGap(Number(e.target.value)) })] }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsxs)("label", { children: ["Font size", (0, jsx_runtime_1.jsx)("input", { type: "number", max: 22, min: 4, value: fontSize, onChange: (e) => setFontSize(Number(e.target.value)) })] }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)("div", { style: { background: "#eee", width }, children: (0, jsx_runtime_1.jsx)(shrink_to_fit_width_1.ShrinkToFitWidth, { maxCount: numberOfStates, maxWidth: width, children: ({ ref, count }) => ((0, jsx_runtime_1.jsx)(ExampleContent, { ref: ref, count: numberOfStates, visibleCount: count, gap: gap, fontSize: fontSize })) }) })] }));
};
const ExampleContent = react_1.default.forwardRef(({ count, visibleCount, gap, fontSize }, ref) => {
    if (visibleCount === null)
        return (0, jsx_runtime_1.jsx)("span", { children: "No fit!" });
    const includedStateNames = stateNames.slice(0, count);
    const visibleStateNames = includedStateNames.slice(0, visibleCount);
    const hiddenStateNamesCount = count - visibleCount;
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: "inline-flex", gap, whiteSpace: "nowrap", fontSize }, ref: ref, children: [visibleCount === 0 && (0, jsx_runtime_1.jsx)("span", { children: `${count} states` }), visibleStateNames.map((s) => ((0, jsx_runtime_1.jsx)("span", { children: s }, s))), hiddenStateNamesCount > 0 && visibleCount > 0 && ((0, jsx_runtime_1.jsx)("span", { children: `+ ${hiddenStateNamesCount} more` }))] }));
});
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
