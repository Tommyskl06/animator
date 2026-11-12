//# sourceMappingURL=extension_test.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import { read_description } from "./extension_ffi.mjs";
import { makeError } from "./gleam.mjs";

const FILEPATH = "test/extension_test.gleam";

const min_characters = 400;

const stub = "Describe your extension(s) here before implementing them.";

export function description_test() {
  let _block;
  let _pipe = read_description();
  let _pipe$1 = $string.replace(_pipe, stub, "");
  _block = $string.trim(_pipe$1);
  let description = _block;
  let length = $string.length(description);
  let $ = length >= min_characters;
  if ($) {
    return undefined;
  } else {
    throw makeError(
      "panic",
      FILEPATH,
      "extension_test",
      21,
      "description_test",
      (((("extension.txt has " + $int.to_string(length)) + " characters of description, but Problem 12 asks for at least ") + $int.to_string(
        min_characters,
      )) + ". Describe your extension(s) there before implementing them."),
      {}
    )
  }
}
