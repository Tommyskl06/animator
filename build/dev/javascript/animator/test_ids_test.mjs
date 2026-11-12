//# sourceMappingURL=test_ids_test.mjs.map
import * as $query from "../lustre/lustre/dev/query.mjs";
import * as $simulate from "../lustre/lustre/dev/simulate.mjs";
import * as $app from "./app.mjs";
import { Ok, makeError } from "./gleam.mjs";

const FILEPATH = "test/test_ids_test.gleam";

function assert_rendered(selector, message) {
  let sim = $simulate.start(
    $simulate.application($app.init, $app.update, $app.view),
    undefined,
  );
  let $ = $query.find($simulate.view(sim), $query.element(selector));
  if ($ instanceof Ok) {
    return undefined;
  } else {
    throw makeError(
      "panic",
      FILEPATH,
      "test_ids_test",
      23,
      "assert_rendered",
      message,
      {}
    )
  }
}

export function canvas_id_test() {
  return assert_rendered(
    $query.and($query.tag("canvas"), $query.id("animation-canvas")),
    "When the app opens, there is no <canvas id=\"animation-canvas\"> element. Add one to the view, using attr.id(\"animation-canvas\").",
  );
}

export function code_editor_id_test() {
  return assert_rendered(
    $query.id("code-editor"),
    "When the app opens, no element has the id \"code-editor\", which editor.view_panel provides. Keep it in the view.",
  );
}

export function shape_slider_id_test() {
  return assert_rendered(
    $query.test_id("shape-slider"),
    "When the app opens, no element has data-test-id=\"shape-slider\". Tag the slider that sets shape_slider with attr.attribute(\"data-test-id\", \"shape-slider\"), and keep it in the view.",
  );
}

export function speed_slider_id_test() {
  return assert_rendered(
    $query.test_id("speed-slider"),
    "When the app opens, no element has data-test-id=\"speed-slider\". Tag the speed slider with attr.attribute(\"data-test-id\", \"speed-slider\"), and keep it in the view.",
  );
}

export function drawing_select_id_test() {
  return assert_rendered(
    $query.and($query.tag("select"), $query.test_id("drawing-select")),
    "When the app opens, there is no <select> with data-test-id=\"drawing-select\". Tag the drop-down menu with attr.attribute(\"data-test-id\", \"drawing-select\").",
  );
}
