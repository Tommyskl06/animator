//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.

import examples
import gleam/dict.{type Dict}
import gleam/dynamic/decode
import gleam/json
import gleam/list

@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String

const storage_key = "gleam_animator_drawings_v1"

const active_key = "gleam_animator_active_drawing"

pub type Library {
  Library(active: String, drawings: Dict(String, String))
}

pub fn load_library() -> Library {
  let default_drawings = dict.from_list(examples.all)
  let default_active = case list.first(examples.all) {
    Ok(#(name, _)) -> name
    Error(_) -> "Example"
  }

  case storage_get(storage_key) {
    Ok(json_str) -> {
      let saved_drawings = decode_drawings(json_str)
      let active_drawing = case storage_get(active_key) {
        Ok(name) if name != "" -> name
        _ -> default_active
      }

      case dict.is_empty(saved_drawings) {
        False -> Library(active: active_drawing, drawings: saved_drawings)
        True -> Library(active: default_active, drawings: default_drawings)
      }
    }
    Error(_) -> Library(active: default_active, drawings: default_drawings)
  }
}

pub fn save_library(lib: Library) -> Nil {
  let json_str = encode_drawings(lib.drawings)
  storage_set(storage_key, json_str)
  storage_set(active_key, lib.active)
}

fn encode_drawings(drawings: Dict(String, String)) -> String {
  dict.to_list(drawings)
  |> list.map(fn(pair) { #(pair.0, json.string(pair.1)) })
  |> json.object
  |> json.to_string
}

fn decode_drawings(json_str: String) -> Dict(String, String) {
  let decoder = decode.dict(decode.string, decode.string)
  case json.parse(json_str, decoder) {
    Ok(d) -> d
    Error(_) -> dict.new()
  }
}
