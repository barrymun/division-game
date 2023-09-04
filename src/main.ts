import van, { State } from "vanjs-core";

import { Alert, Spacer } from "components";
import { correctAnswersToWin, startingLives } from "constants";
import { AlertMessage } from "types";
import { generateNumberToDivide, randomIntFromInterval } from "utils";

import backgroundSrc from 'assets/img/background.png';
import heartSrc from 'assets/img/heart.png';
import restartSrc from 'assets/img/restart.png';

import 'assets/style.css';

const { button, div, img, span } = van.tags;

const domEntrypoint = document.getElementById('app')! as HTMLDivElement;

let divisor = van.state(0);
let numberToDivide = van.state(0);
let answer = van.state(0);
let twentyCount = van.state(0);
let tenCount = van.state(0);
let fiveCount = van.state(0);
let oneCount = van.state(0);
let lives = van.state(startingLives);
let correctAnswers = van.state(0);
let alertMessage: State<AlertMessage> = van.state(AlertMessage.Blank);

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

const restartGame = (): void => {
  setGameNumbers();
  lives.val = startingLives;
  correctAnswers.val = 0;
  alertMessage.val = AlertMessage.Blank;
};

const Background = (): HTMLImageElement => {
  return img({ 
    class: "background-img",
    src: backgroundSrc,
  });
};

const Restart = (): HTMLDivElement => {
  return div({ 
    class: "restart",
    onclick: restartGame,
  },
    img({ src: restartSrc }),
  );
};

const Lives = () => {
  return van.derive(() => {
    return div(
      Array.from(
        Array(lives.val))
          .map(() => img({ src: heartSrc, class: "life" })
      )
    );
  });
};

const Completed = (): HTMLDivElement => {
  return div(
    { class: "completed" },
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
    div({ class: "text-medium" },
      span("Divided by "),
      span(divisor),
    ),
  );
};

const InteractiveSum = () => {
  return van.derive(() => {
    const previousSum: number = twentyCount.oldVal * 20 + tenCount.oldVal * 10 + fiveCount.oldVal * 5 + oneCount.oldVal;
    const sum: number = twentyCount.val * 20 + tenCount.val * 10 + fiveCount.val * 5 + oneCount.val;
    if (sum === 0) {
      return div({
        class: previousSum > 0 ? "interactive-sum interactive-sum-hide" : "",
      });
    } else {
      return div({
        class: previousSum === 0 ? "interactive-sum interactive-sum-show" : "interactive-sum",
      }, sum);
    }
  });
};

const Decrementor = ({ handleClick, count }: { handleClick: () => void; count: number; }) => {
  if (count === 0) return span();
  
  return div(
    { 
      class: "decrementor-container",
      onclick: handleClick,
    },
    div({
      class: "decrementor decrementor-full",
    }, ""),
    Array.from(
      Array(count > 0 ? count - 1 : 0))
        .map(() => div({ class: "decrementor decrementor-mini" }, "")
    )
  );
};

const InteractiveStack = (): HTMLDivElement => {
  return div({class: "interactive-stack"},
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
            alertMessage.val = AlertMessage.Correct;
          }
        } else {
          --lives.val;
          if (lives.val > 0) {
            alertMessage.val = AlertMessage.Incorrect;
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
      InteractiveStack(),
      Spacer(),
      Submit(),
    ),
  );
};

const AlertContainer = (): HTMLDivElement => {
  return div(
    { class: "alert-container" },
    van.derive(() => Alert(alertMessage.val)),
  );
};

van.derive(() => {
  if (lives.val === 0) {
    alertMessage.val = AlertMessage.Lose;
    restartGame();
  }

  if (correctAnswers.val === correctAnswersToWin) {
    alertMessage.val = AlertMessage.Win;
    restartGame();
  }
});

van.derive(() => {
  if (alertMessage.val === AlertMessage.Correct) {
    setTimeout(() => {
      alertMessage.val = AlertMessage.Blank;
    }, 1000);
  }

  if (alertMessage.val === AlertMessage.Incorrect) {
    setTimeout(() => {
      alertMessage.val = AlertMessage.Blank;
    }, 2000);
  }
});

van.add(domEntrypoint, Background());
van.add(domEntrypoint, Restart());
van.add(domEntrypoint, GameInfo());
van.add(domEntrypoint, App());
van.add(domEntrypoint, AlertContainer());

const onLoad = (): void => {};

window.addEventListener("load", onLoad);

window.addEventListener("unload", () => {
  window.removeEventListener("load", onLoad);
});
