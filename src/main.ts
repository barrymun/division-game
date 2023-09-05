import van, { State } from "vanjs-core";

import { Alert, Spacer } from "components";
import { correctAnswersToWin, startingLives } from "constants";
import { AlertMessage } from "types";
import { generateNumberToDivide, randomIntFromInterval } from "utils";

import backgroundSrc from 'assets/img/background.png';
import closeSrc from 'assets/img/close.png';
import heartSrc from 'assets/img/heart.png';
import infoSrc from 'assets/img/info.png';
import restartSrc from 'assets/img/restart.png';

import 'assets/style.css';

const { button, div, img, p, span } = van.tags;

const domEntrypoint = document.getElementById('app')! as HTMLDivElement;

let alertMessageTimeoutId: number | undefined;

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
let infoPanelOpen = van.state(false);
let noticePanelOpen = van.state(false);

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
  infoPanelOpen.val = false;
  noticePanelOpen.val = false;
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
  return div(
    Array.from(
      Array(lives.val))
        .map(() => img({ src: heartSrc, class: "life" })
    )
  );
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
    () => Lives(),
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
};

const Decrementor = ({ handleClick, count }: { handleClick: () => void; count: number; }): HTMLDivElement => {
  if (count === 0) return div();
  
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
    () => Decrementor({ 
      handleClick: () => twentyCount.val > 0 ? --twentyCount.val : 0,
      count: twentyCount.val,
    }),
    () => Decrementor({ 
      handleClick: () => tenCount.val > 0 ? --tenCount.val : 0,
      count: tenCount.val,
    }),
    () => Decrementor({ 
      handleClick: () => fiveCount.val > 0 ? --fiveCount.val : 0,
      count: fiveCount.val,
    }),
    () => Decrementor({ 
      handleClick: () => oneCount.val > 0 ? --oneCount.val : 0,
      count: oneCount.val,
    }),
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

const Submit = () => {
  const sum: number = twentyCount.val * 20 + tenCount.val * 10 + fiveCount.val * 5 + oneCount.val;
  return div(
    { class: "answer" },
    button({
      disabled: sum === 0,
      onclick: () => {
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
      () => InteractiveSum(),
    ),
    div(
      { class: "bottom-section" },
      () => InteractiveStack(),
      Spacer(),
      () => Submit(),
    ),
  );
};

const AlertContainer = (): HTMLDivElement => {
  return div(
    { class: "alert-container" },
    () => Alert(alertMessage.val),
  );
};

const InfoContainer = (): HTMLDivElement => {
  return div({ 
    class: "info-container",
    onclick: () => infoPanelOpen.val = true,
  },
    img({ src: infoSrc }),
  );
};

const InfoPanel = () => {
  if (!infoPanelOpen.val) return div();
  
  return div(
    { class: "info-panel" },
    div(
      { class: "info-panel-header" },
      div("How to play"),
      img({ 
        class: "info-panel-close",
        src: closeSrc,
        onclick: () => infoPanelOpen.val = false,
      }),
    ),
    div(
      { class: "info-panel-body" },
      p(
        { class: "info-panel-body-section" },
        span("Divide the number on the left by the number on the right."),
      ),
      p(
        { class: "info-panel-body-section" },
        span("Use the buttons to add or subtract from the sum."),
      ),
      p(
        { class: "info-panel-body-section" },
        span("Click submit to check your answer."),
      ),
      p(
        { class: "info-panel-body-section" },
        span("You have "),
        span(startingLives),
        span(" lives."),
      ),
      p(
        { class: "info-panel-body-section" },
        span("You need "),
        span(correctAnswersToWin),
        span(" correct answers to win."),
      ),
    ),
  );
};

const NoticePanel = () => {
  if (!noticePanelOpen.val) return div();
    
  return div(
    { class: "notice-panel" },
    div(
      { class: "notice-panel-body" },
      div(
        { class: "notice-panel-message" },
        alertMessage,
      ),
      div(
        button({ 
          class: "notice-panel-button", 
          onclick: restartGame,
        }, "Play again")
      )
    )
  );
};

van.derive(() => {
  if (lives.val === 0) {
    alertMessage.val = AlertMessage.Lose;
    noticePanelOpen.val = true;
    Object.assign(domEntrypoint.style, { pointerEvents: "none" });
  } else {
    Object.assign(domEntrypoint.style, { pointerEvents: "auto" });
  }

  if (correctAnswers.val === correctAnswersToWin) {
    alertMessage.val = AlertMessage.Win;
    noticePanelOpen.val = true;
  }
});

van.derive(() => {
  if (
    alertMessage.val !== AlertMessage.Correct 
    && alertMessage.val !== AlertMessage.Incorrect
    && alertMessageTimeoutId
  ) {
    clearInterval(alertMessageTimeoutId);
  }
  
  if (alertMessage.val === AlertMessage.Correct) {
    alertMessageTimeoutId = setTimeout(() => {
      alertMessage.val = AlertMessage.Blank;
    }, 1000);
  }

  if (alertMessage.val === AlertMessage.Incorrect) {
    alertMessageTimeoutId = setTimeout(() => {
      alertMessage.val = AlertMessage.Blank;
    }, 2000);
  }
});

van.add(domEntrypoint, Background());
van.add(domEntrypoint, Restart());
van.add(domEntrypoint, GameInfo());
van.add(domEntrypoint, App());
van.add(domEntrypoint, AlertContainer());
van.add(domEntrypoint, InfoContainer());
van.add(domEntrypoint, () => InfoPanel());
van.add(domEntrypoint, () => NoticePanel());

const onLoad = (): void => {};

window.addEventListener("load", onLoad);

window.addEventListener("unload", () => {
  window.removeEventListener("load", onLoad);
});
