import { createLayer } from "core";
import { contactLayer } from "./contact";

export const api = createLayer({
  contact: contactLayer,
});
