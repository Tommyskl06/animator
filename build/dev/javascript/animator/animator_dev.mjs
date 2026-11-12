//# sourceMappingURL=animator_dev.mjs.map
import { start } from "./animator_dev_ffi.mjs";

const default_port = 8000;

export function main() {
  return start(default_port);
}
