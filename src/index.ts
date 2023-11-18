import { run } from "~/core";

import "~/db";

import home from "~/routes/index";
import counter from "~/routes/counter";

run([home, counter]);
