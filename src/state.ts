import { createState } from "./core/State";

const { State, ObjectState } = createState();

type FieldErrors = Record<string, string[] | undefined>;

export const state = {
  counter: {
    count: new State<number>("counter:count", { default: 0 }),
  },
  home: {
    errors: new ObjectState<FieldErrors>("home:errors", { default: {} }),
  },
};
