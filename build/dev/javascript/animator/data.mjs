//# sourceMappingURL=data.mjs.map
import * as $json from "../gleam_json/gleam/json.mjs";
import * as $dict from "../gleam_stdlib/gleam/dict.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import {
  storageGet as storage_get,
  storageSet as storage_set,
  promptDrawingName as prompt_drawing_name,
} from "./data_ffi.mjs";
import * as $examples from "./examples.mjs";
import { Ok, CustomType as $CustomType } from "./gleam.mjs";

export { prompt_drawing_name, storage_get, storage_set };

export class Library extends $CustomType {
  constructor(active, drawings) {
    super();
    this.active = active;
    this.drawings = drawings;
  }
}
export const Library$Library = (active, drawings) =>
  new Library(active, drawings);
export const Library$isLibrary = (value) => value instanceof Library;
export const Library$Library$active = (value) => value.active;
export const Library$Library$0 = (value) => value.active;
export const Library$Library$drawings = (value) => value.drawings;
export const Library$Library$1 = (value) => value.drawings;

const active_key = "gleam_animator_active_drawing";

const storage_key = "gleam_animator_drawings_v1";

function decode_drawings(json_str) {
  let decoder = $decode.dict($decode.string, $decode.string);
  let $ = $json.parse(json_str, decoder);
  if ($ instanceof Ok) {
    let d = $[0];
    return d;
  } else {
    return $dict.new$();
  }
}

export function load_library() {
  let default_drawings = $dict.from_list($examples.all);
  let _block;
  let $ = $list.first($examples.all);
  if ($ instanceof Ok) {
    let name = $[0][0];
    _block = name;
  } else {
    _block = "Example";
  }
  let default_active = _block;
  let $1 = storage_get(storage_key);
  if ($1 instanceof Ok) {
    let json_str = $1[0];
    let saved_drawings = decode_drawings(json_str);
    let _block$1;
    let $2 = storage_get(active_key);
    if ($2 instanceof Ok) {
      let name = $2[0];
      if (name !== "") {
        _block$1 = name;
      } else {
        _block$1 = default_active;
      }
    } else {
      _block$1 = default_active;
    }
    let active_drawing = _block$1;
    let $3 = $dict.is_empty(saved_drawings);
    if ($3) {
      return new Library(default_active, default_drawings);
    } else {
      return new Library(active_drawing, saved_drawings);
    }
  } else {
    return new Library(default_active, default_drawings);
  }
}

function encode_drawings(drawings) {
  let _pipe = $dict.to_list(drawings);
  let _pipe$1 = $list.map(
    _pipe,
    (pair) => { return [pair[0], $json.string(pair[1])]; },
  );
  let _pipe$2 = $json.object(_pipe$1);
  return $json.to_string(_pipe$2);
}

export function save_library(lib) {
  let json_str = encode_drawings(lib.drawings);
  storage_set(storage_key, json_str);
  return storage_set(active_key, lib.active);
}
