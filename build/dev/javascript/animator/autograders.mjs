//# sourceMappingURL=autograders.mjs.map
import * as $app from "./app.mjs";
import { run_deployment_autograder, run_video_autograder } from "./autograders_ffi.mjs";

export function deployment_autograder_test() {
  return run_deployment_autograder($app.public_url);
}

export function video_autograder_test() {
  return run_video_autograder($app.video_url);
}
