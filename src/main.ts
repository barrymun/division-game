import van from "vanjs-core";

// import './style.css';

const {button, div, pre} = van.tags

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const Run = ({ sleepMs }: { sleepMs: number }) => {
  const headingSpaces = van.state(40);
  const trailingUnderscores = van.state(0);

  const animate = async () => {
    while (headingSpaces.val > 0) {
      await sleep(sleepMs);
      --headingSpaces.val;
      ++trailingUnderscores.val;
    }
  }
  animate();

  return pre(() =>
    `${" ".repeat(headingSpaces.val)}🚐💨Hello VanJS!${"_".repeat(trailingUnderscores.val)}`);
}

const Hello = (): HTMLDivElement => {
  const dom = div()
  return div(
    dom,
    button({onclick: () => van.add(dom, Run({sleepMs: 2000}))}, "Hello 🐌"),
    button({onclick: () => van.add(dom, Run({sleepMs: 500}))}, "Hello 🐢"),
    button({onclick: () => van.add(dom, Run({sleepMs: 100}))}, "Hello 🚶‍♂️"),
    button({onclick: () => van.add(dom, Run({sleepMs: 10}))}, "Hello 🏎️"),
    button({onclick: () => van.add(dom, Run({sleepMs: 2}))}, "Hello 🚀"),
  );
}

van.add(document.body, Hello());
