import van from "vanjs-core";

import { correctAnswersToWin } from "constants";
import { generateNumberToDivide, randomIntFromInterval } from "utils";

import './style.css';

const {button, div, span} = van.tags

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

const Lives = (): HTMLDivElement => {
  return div(
    div(lives),
  );
};

const Completed = (): HTMLDivElement => {
  return div(
    span(correctAnswers),
    span(" / "),
    span(correctAnswersToWin),
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
      { class: "game-info" },
      Lives(),
      Completed(),
    ),
    Display(),
    InteractiveSum(),
    Interactive(),
    Submit(),
  );
};

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

van.add(document.getElementById('app')! as HTMLDivElement, App());
