import { createState } from "./core/State";

const { State, ObjectState } = createState();

type StrRec = Record<string, string>;

export const state = {
  counter: {
    count: new State("counter:count", { default: 0 }),
  },
  home: {
    errors: new ObjectState<StrRec>("home:errors", { default: {} }),
  },
};
