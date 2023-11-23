import { createApi } from "core";
import { _contact } from "./contact";

export const api = createApi({
  contact: _contact,
});
