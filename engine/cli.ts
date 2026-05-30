import { config } from "dotenv";
config({ path: ".env.local" });

import { runTick } from "./tick";
import { wipeCycle } from "./storage";
import { initialState } from "./state";
import { setState, snapshotState } from "./storage";

async function main() {
  const cmd = process.argv[2] ?? "tick";
  const cycle = Number(process.env.PENTARCHY_CYCLE ?? 0);

  switch (cmd) {
    case "tick": {
      console.log(`→ running tick for cycle ${cycle}…`);
      const result = await runTick();
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case "init": {
      console.log(`→ initialising cycle ${cycle}…`);
      const state = initialState(cycle);
      await setState(state);
      await snapshotState(state);
      console.log("✓ initial state written");
      break;
    }
    case "reset": {
      console.log(`→ wiping cycle ${cycle}…`);
      await wipeCycle(cycle);
      console.log("✓ cycle wiped");
      break;
    }
    default:
      console.error(`unknown command: ${cmd}`);
      console.error("usage: tsx engine/cli.ts [tick|init|reset]");
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
