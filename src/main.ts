import van from "vanjs-core";

import './style.css';

const {button, div} = van.tags

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// const Run = ({ sleepMs }: { sleepMs: number }): HTMLPreElement => {
//   const headingSpaces = van.state(40);
//   const trailingUnderscores = van.state(0);

//   const animate = async () => {
//     while (headingSpaces.val > 0) {
//       await sleep(sleepMs);
//       --headingSpaces.val;
//       ++trailingUnderscores.val;
//     }
//   }
//   animate();

//   return pre(() =>
//     `${" ".repeat(headingSpaces.val)}🚐💨Hello VanJS!${"_".repeat(trailingUnderscores.val)}`);
// }

// const Hello = (): HTMLDivElement => {
//   const dom = div()
//   return div(
//     dom,
//     button({onclick: () => van.add(dom, Run({sleepMs: 2000}))}, "Hello 🐌"),
//     button({onclick: () => van.add(dom, Run({sleepMs: 500}))}, "Hello 🐢"),
//     button({onclick: () => van.add(dom, Run({sleepMs: 100}))}, "Hello 🚶‍♂️"),
//     button({onclick: () => van.add(dom, Run({sleepMs: 10}))}, "Hello 🏎️"),
//     button({onclick: () => van.add(dom, Run({sleepMs: 2}))}, "Hello 🚀"),
//   );
// }

let numbertoDivide = van.state(1276);
let divisor = van.state(2);
let twentyCount = van.state(0);
// van.derive(() => console.log(`Counter: ${twentyCount.val}`))
let tenCount = van.state(0);
let fiveCount = van.state(0);
let oneCount = van.state(0);

const Display = (): HTMLDivElement => {
  return div(
    {class: "display"},
    div(numbertoDivide.val),
    div(`Divided by ${divisor.val}`),
  );
};

const InteractiveSum = (): HTMLDivElement => {
  const value = van.derive(() => {
    return twentyCount.val * 20 + tenCount.val * 10 + fiveCount.val * 5 + oneCount.val;
  });
  return div({
    class: "interactive-sum",
  }, value);
};

const Interactive = (): HTMLDivElement => {
  return div({class: "interactive"},
    div({
      class: "decrementor",
      onclick: () => twentyCount.val > 0 ? --twentyCount.val : 0
    }, twentyCount),
    div({
      class: "decrementor",
      onclick: () => tenCount.val > 0 ? --tenCount.val : 0
    }, tenCount),
    div({
      class: "decrementor",
      onclick: () => fiveCount.val > 0 ? --fiveCount.val : 0
    }, fiveCount),
    div({
      class: "decrementor",
      onclick: () => oneCount.val > 0 ? --oneCount.val : 0
    }, oneCount),
    div(
      button({onclick: () => ++twentyCount.val}, "20"),
    ),
    div(
      button({onclick: () => ++tenCount.val}, "10"),
    ),
    div(
      button({onclick: () => ++fiveCount.val}, "5"),
    ),
    div(
      button({onclick: () => ++oneCount.val}, "1"),
    ),
  );
};

const App = (): HTMLDivElement => {
  return div(
    { class: "container" },
    Display(),
    InteractiveSum(),
    Interactive(),
  );
};

van.add(document.getElementById('app')! as HTMLDivElement, App());
