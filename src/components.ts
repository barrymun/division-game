import van from "vanjs-core";

import { AlertMessage } from "types";

const { div } = van.tags;

export const Spacer = (): HTMLDivElement => div({ class: "spacer" });

export const Alert = (message: AlertMessage): HTMLDivElement => {
    if (message === AlertMessage.Blank) return div();

    let classes: string[] = ['alert'];
    if (message === AlertMessage.Correct) {
        classes = [...classes, 'alert-success'];
    }
    if (message === AlertMessage.Incorrect) {
        classes = [...classes, 'alert-fail'];
    }
    return div({ class: classes.join(' ') }, message);
};
