import gsap from "gsap";
import van from "vanjs-core";

import { Spacer } from "components";
import { correctAnswersToWin } from "constants";
import { generateNumberToDivide, randomIntFromInterval } from "utils";

import backgroundSrc from 'assets/img/background.png'

import 'assets/style.css';

const { button, div, img, span } = van.tags;

const domEntrypoint = document.getElementById('app')! as HTMLDivElement;
// const midSection = document.querySelector('.mid-section')! as HTMLDivElement;

let divisor = van.state(0);
let numberToDivide = van.state(0);
let answer = van.state(0);
let twentyCount = van.state(0);
let tenCount = van.state(0);
let fiveCount = van.state(0);
let oneCount = van.state(0);
let lives = van.state(3);
let correctAnswers = van.state(0);

const setGameNumbers = (): void => {
  let randomDivisor = randomIntFromInterval({min: 2, max: 12});
  let randomNumberToDivide = generateNumberToDivide(randomDivisor);

  divisor.val = randomDivisor;
  numberToDivide.val = randomNumberToDivide;
  answer.val = randomNumberToDivide / randomDivisor;
  twentyCount.val = 0;
  tenCount.val = 0;
  fiveCount.val = 0;
  oneCount.val = 0;
};

setGameNumbers();

const Background = (): HTMLImageElement => {
  return img({ 
    class: "background-img",
    src: backgroundSrc,
  });
};

const Lives = (): HTMLDivElement => {
  return div(lives);
};

const Completed = (): HTMLDivElement => {
  return div(
    span(correctAnswers),
    span(" / "),
    span(correctAnswersToWin),
  );
};

const GameInfo = (): HTMLDivElement => {
  return div(
    { class: "game-info" },
    Lives(),
    Completed(),
  );
};

const Display = (): HTMLDivElement => {
  return div(
    { class: "display" },
    div(numberToDivide),
    div(
      span("Divided by "),
      span(divisor),
    ),
  );
};

const InteractiveSum = () => {
  return van.derive(() => {
    const sum: number = twentyCount.val * 20 + tenCount.val * 10 + fiveCount.val * 5 + oneCount.val;
    if (sum === 0) {
      return div();
    } else {
      return div({
        class: "interactive-sum",
      }, sum);
    }
  });
};

const Decrementor = ({ handleClick, count }: { handleClick: () => void; count: number }) => {
  if (count === 0) return span();
  
  return div(
    { class: "decrementor-container" },
    div({
      class: "decrementor decrementor-full",
      onclick: handleClick,
    }, ""),
    Array.from(
      Array(count > 0 ? count - 1 : 0))
        .map((_) => div({ class: "decrementor decrementor-mini" }, "")
    )
  );
};

const Interactive = (): HTMLDivElement => {
  return div({class: "interactive"},
    van.derive(() => Decrementor({ 
      handleClick: () => twentyCount.val > 0 ? --twentyCount.val : 0,
      count: twentyCount.val,
    })),
    van.derive(() => Decrementor({ 
      handleClick: () => tenCount.val > 0 ? --tenCount.val : 0,
      count: tenCount.val,
    })),
    van.derive(() => Decrementor({ 
      handleClick: () => fiveCount.val > 0 ? --fiveCount.val : 0,
      count: fiveCount.val,
    })),
    van.derive(() => Decrementor({ 
      handleClick: () => oneCount.val > 0 ? --oneCount.val : 0,
      count: oneCount.val,
    })),
    div(
      button({
        class: "incrementor",
        onclick: () => ++twentyCount.val
      }, "20"),
    ),
    div(
      button({
        class: "incrementor",
        onclick: () => ++tenCount.val
      }, "10"),
    ),
    div(
      button({
        class: "incrementor",
        onclick: () => ++fiveCount.val
      }, "5"),
    ),
    div(
      button({
        class: "incrementor",
        onclick: () => ++oneCount.val
      }, "1"),
    ),
  );
};

const Submit = (): HTMLDivElement => {
  return div(
    { class: "answer" },
    button({
      onclick: () => {
        const sum = twentyCount.val * 20 + tenCount.val * 10 + fiveCount.val * 5 + oneCount.val;
        if (sum === answer.val) {
          ++correctAnswers.val;
          if (correctAnswers.val < correctAnswersToWin) {
            alert("Correct!");
          }
        } else {
          --lives.val;
          if (lives.val > 0) {
            alert(`Incorrect! The answer is ${answer.val}`);
          }
        }
        setGameNumbers();
      },
    }, "Submit")
  );
};

const App = (): HTMLDivElement => {
  return div(
    { class: "container" },
    div(
      { class: "top-section" },
      Display(),
    ),
    div(
      { class: "mid-section" },
      InteractiveSum(),
    ),
    div(
      { class: "bottom-section" },
      Interactive(),
      Spacer(),
      Submit(),
    ),
  );
};

// van.derive(() => {
//   console.log('1')
//   if (!document.querySelector(".interactive-sum")) return;
//   console.log('2')
//   gsap.fromTo(".interactive-sum", {opacity: 0}, {opacity: 1, duration: 3});
// });

van.derive(() => {
  if (lives.val === 0) {
    alert("Game over!");
    location.reload();
  }

  if (correctAnswers.val === correctAnswersToWin) {
    alert("You win!");
    location.reload();
  }
});

van.add(domEntrypoint, Background());
van.add(domEntrypoint, GameInfo());
van.add(domEntrypoint, App());

const observer = new MutationObserver((mutations, _observer) => {
  // mutations.forEach((mutation) => {
  //   console.log(mutation)
  // });
  console.log('1')
  if (document.querySelector('.interactive-sum')) {
    console.log('A')
    gsap.fromTo(".interactive-sum", {opacity: 0}, {opacity: 1, duration: 2});
  } else {
    console.log('B')
    // gsap.fromTo(".interactive-sum", {opacity: 1}, {opacity: 0, duration: 2});
  }
});

const onLoad = (): void => {
  // observer.observe(document.body, { attributes: true, childList: true, subtree: true });
  // observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.body, { childList: true, subtree: true, attributeFilter: ['class'] });
};

window.addEventListener("load", onLoad);

window.addEventListener("unload", () => {
  window.removeEventListener("load", onLoad);
  observer.disconnect();
});
