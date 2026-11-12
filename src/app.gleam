//// Animator -- interactive particle collection and path-following game extension.

import builtins
import data
import drawing
import editor
import errors
import gleam/dict.{type Dict}
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/list
import gleam/result
import gleam/string
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/event
import parser
import render
import shape.{type Path, type Point, Point}

pub const public_url = "https://github.com/Tommyskl06/animator"

pub const include_app_in_gallery = True

pub const video_url = ""

pub const include_video_in_gallery = False

const default_code =
  "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0.0, 10.0, 2.0)]\n}\n"

// ── Model ──────────────────────────────────────────────────────────────────────

pub type Model {
  Model(
    source: String,
    code_open: Bool,
    output: String,
    shape_slider: Int,
    speed: Float,
    active_drawing: String,
    drawings: Dict(String, String),
    // Extension State (unified 1000x1000 world coordinates: -500.0 to +500.0)
    score: Int,
    health: Int,
    game_over: Bool,
    cooldown_ticks: Int,
    status_msg: String,
    target_pt: Point,
    current_paths: List(render.RenderPath),
  )
}

pub type Msg {
  SetCode(String)
  ToggleCode
  SetShapeSlider(Int)
  SetSpeed(Float)
  SelectDrawing(String)
  CreateDrawing
  // Normalized cursor coordinates on the Canvas container (0.0 to 1.0)
  UpdateMouseNorm(Float, Float)
  ResetGame
}

// ── Init ───────────────────────────────────────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  let lib: data.Library = data.load_library()
  let current_source = case dict.get(lib.drawings, lib.active) {
    Ok(code) -> code
    Error(_) -> default_code
  }

  let #(_, initial_paths) = evaluate_and_render(10, current_source)
  let first_target = pick_target_from_paths(initial_paths, 1, Point(0.0, 0.0))

  #(
    Model(
      source: current_source,
      code_open: True,
      output: "",
      shape_slider: 10,
      speed: 1.0,
      active_drawing: lib.active,
      drawings: lib.drawings,
      score: 0,
      health: 3,
      game_over: False,
      cooldown_ticks: 0,
      status_msg: "Follow cyan lines to collect gold dots!",
      target_pt: first_target,
      current_paths: initial_paths,
    ),
    effect.batch([
      editor.mount(current_source, SetCode),
      effect.from(fn(dispatch) { dispatch(SetCode(current_source)) }),
    ]),
  )
}

fn run_source(shape_slider: Int, source: String) -> Result(List(Path), String) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      drawing.try_draw(shape_slider, program)
      |> result.map_error(errors.error_message)
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    SetCode(text) -> {
      let #(output_text, render_paths) =
        evaluate_and_render(model.shape_slider, text)
      render.set_drawing(render_paths)

      let updated_drawings =
        dict.insert(model.drawings, model.active_drawing, text)
      let next_pt =
        pick_target_from_paths(render_paths, model.score + 1, model.target_pt)

      let new_model =
        Model(
          ..model,
          source: text,
          output: output_text,
          drawings: updated_drawings,
          current_paths: render_paths,
          target_pt: next_pt,
        )

      data.save_library(data.Library(
        active: new_model.active_drawing,
        drawings: updated_drawings,
      ))

      #(new_model, effect.none())
    }

    SetShapeSlider(val) -> {
      let #(output_text, render_paths) = evaluate_and_render(val, model.source)
      render.set_drawing(render_paths)
      let next_pt =
        pick_target_from_paths(render_paths, val + model.score, model.target_pt)
      #(
        Model(
          ..model,
          output: output_text,
          shape_slider: val,
          current_paths: render_paths,
          target_pt: next_pt,
        ),
        effect.none(),
      )
    }

    SetSpeed(spd) -> {
      render.set_speed(spd)
      #(Model(..model, speed: spd), effect.none())
    }

    SelectDrawing(name) -> {
      case name {
        "" -> update(model, CreateDrawing)
        _ -> {
          case dict.get(model.drawings, name) {
            Ok(code) -> {
              let #(output_text, render_paths) =
                evaluate_and_render(model.shape_slider, code)
              render.set_drawing(render_paths)
              let next_pt =
                pick_target_from_paths(render_paths, 7, model.target_pt)

              let new_model =
                Model(
                  ..model,
                  active_drawing: name,
                  source: code,
                  output: output_text,
                  current_paths: render_paths,
                  target_pt: next_pt,
                )
              data.save_library(data.Library(
                active: name,
                drawings: model.drawings,
              ))

              #(new_model, editor.mount(code, SetCode))
            }
            Error(_) -> #(model, effect.none())
          }
        }
      }
    }

    CreateDrawing -> {
      let new_name = data.prompt_drawing_name()
      case new_name {
        "" -> #(model, effect.none())
        _ -> {
          let updated_drawings =
            dict.insert(model.drawings, new_name, default_code)
          let #(output_text, render_paths) =
            evaluate_and_render(model.shape_slider, default_code)
          render.set_drawing(render_paths)
          let next_pt = pick_target_from_paths(render_paths, 3, model.target_pt)

          let new_model =
            Model(
              ..model,
              active_drawing: new_name,
              source: default_code,
              output: output_text,
              drawings: updated_drawings,
              current_paths: render_paths,
              target_pt: next_pt,
            )
          data.save_library(data.Library(
            active: new_name,
            drawings: updated_drawings,
          ))

          #(new_model, editor.mount(default_code, SetCode))
        }
      }
    }

    // Cursor tracking: maps normalized screen input to 1000x1000 world coordinates
    UpdateMouseNorm(norm_x, norm_y) -> {
      case model.game_over {
        True -> #(model, effect.none())
        False -> {
          // 1. Convert normalized coordinates (0.0..1.0) to world space (-500.0..+500.0)
          let wx = { norm_x -. 0.5 } *. 1000.0
          let wy = { norm_y -. 0.5 } *. 1000.0

          let current_cd = case model.cooldown_ticks > 0 {
            True -> model.cooldown_ticks - 1
            False -> 0
          }

          // 2. Check target collection (70-unit world radius for smooth corner pickups)
          let dx = wx -. model.target_pt.x
          let dy = wy -. model.target_pt.y
          let hit_target = { dx *. dx +. dy *. dy } <=. 4900.0

          let #(new_score, next_pt, msg_collected) = case hit_target {
            True -> {
              let ns = model.score + 50
              let pt =
                pick_target_from_paths(
                  model.current_paths,
                  ns + 13,
                  model.target_pt,
                )
              #(ns, pt, "✨ COLLECTED! (+50)")
            }
            False -> #(model.score, model.target_pt, model.status_msg)
          }

          // 3. Check off-track collision (95-unit world threshold from nearest segment)
          let min_dist = get_min_dist_to_segments(wx, wy, model.current_paths)
          let is_inside_arena =
            norm_x >. 0.05 && norm_x <. 0.95 && norm_y >. 0.05 && norm_y <. 0.95
          let is_off_track = min_dist >. 95.0 && is_inside_arena

          let #(final_health, final_cd, final_msg, is_dead) = case
            is_off_track && current_cd == 0
          {
            True -> {
              let nh = model.health - 1
              case nh <= 0 {
                True -> #(0, 0, "💥 GAME OVER!", True)
                False -> #(nh, 35, "⚠️ OFF TRACK! (-1 HP)", False)
              }
            }
            False -> #(
              model.health,
              current_cd,
              msg_collected,
              model.health <= 0,
            )
          }

          #(
            Model(
              ..model,
              score: new_score,
              health: final_health,
              game_over: is_dead,
              cooldown_ticks: final_cd,
              status_msg: final_msg,
              target_pt: next_pt,
            ),
            effect.none(),
          )
        }
      }
    }

    ResetGame -> {
      let next_pt =
        pick_target_from_paths(model.current_paths, 5, model.target_pt)
      #(
        Model(
          ..model,
          score: 0,
          health: 3,
          game_over: False,
          cooldown_ticks: 0,
          status_msg: "Game Reset! Follow the cyan lines.",
          target_pt: next_pt,
        ),
        effect.none(),
      )
    }
  }
}

fn evaluate_and_render(
  shape_slider: Int,
  source: String,
) -> #(String, List(render.RenderPath)) {
  case run_source(shape_slider, source) {
    Ok(paths) -> {
      let r_paths = list.map(paths, fn(p) { render.render_path(p, "#00ffff") })
      #(string.inspect(paths), r_paths)
    }
    Error(msg) -> #(msg, [])
  }
}

// ── View ──────────────────────────────────────────────────────────────────

pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }

  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      editor.view_panel(ToggleCode),
    ]),
    view_anim(model),
  ])
}

fn view_anim(model: Model) -> Element(Msg) {
  // Decode relative cursor offset and normalize against canvas client dimensions
  let mouse_decoder = {
    use ox <- decode.field("offsetX", decode.float)
    use oy <- decode.field("offsetY", decode.float)
    use target <- decode.field("target", {
      use w <- decode.field("clientWidth", decode.float)
      use h <- decode.field("clientHeight", decode.float)
      decode.success(#(w, h))
    })
    let #(w, h) = target
    let nx = case w >. 0.0 {
      True -> ox /. w
      False -> 0.5
    }
    let ny = case h >. 0.0 {
      True -> oy /. h
      False -> 0.5
    }
    decode.success(UpdateMouseNorm(nx, ny))
  }

  // Convert world coordinates (-500..+500) to CSS percentage offsets (0%..100%)
  let left_pct = { model.target_pt.x /. 1000.0 +. 0.5 } *. 100.0
  let top_pct = { model.target_pt.y /. 1000.0 +. 0.5 } *. 100.0

  html.div([attr.class("canvas-area"), attr.style("position", "relative")], [
    view_reveal_code(model),
    view_game_stats(model),
    view_controls(model),

    // Responsive wrapper aligning the canvas and gold target marker across any resolution
    html.div(
      [
        attr.style("position", "relative"),
        attr.style("display", "inline-block"),
        attr.style("line-height", "0"),
      ],
      [
        html.canvas([
          attr.id("animation-canvas"),
          attr.class("canvas"),
          attr.style("pointer-events", "auto"),
          attr.style("cursor", "crosshair"),
          event.on("mousemove", mouse_decoder),
        ]),

        // Gold target particle positioned directly on the rendered path geometry
        html.div(
          [
            attr.style("position", "absolute"),
            attr.style("left", float.to_string(left_pct) <> "%"),
            attr.style("top", float.to_string(top_pct) <> "%"),
            attr.style("transform", "translate(-50%, -50%)"),
            attr.style("width", "10px"),
            attr.style("height", "10px"),
            attr.style("background", "#ffd700"),
            attr.style("border-radius", "50%"),
            attr.style("box-shadow", "0 0 8px #ffd700, 0 0 14px #ffae00"),
            attr.style("pointer-events", "none"),
            attr.style("z-index", "5"),
          ],
          [],
        ),
      ],
    ),

    html.pre([attr.class("output")], [html.text(model.output)]),
  ])
}

fn view_game_stats(model: Model) -> Element(Msg) {
  html.div(
    [
      attr.style("position", "absolute"),
      attr.style("top", "10px"),
      attr.style("right", "20px"),
      attr.style("z-index", "10"),
      attr.style("background", "rgba(15, 23, 42, 0.85)"),
      attr.style("padding", "8px 14px"),
      attr.style("border-radius", "6px"),
      attr.style("color", "white"),
      attr.style("font-size", "14px"),
      attr.style("font-family", "sans-serif"),
      attr.style("display", "flex"),
      attr.style("align-items", "center"),
      attr.style("gap", "12px"),
      attr.style("border", "1px solid rgba(255, 255, 255, 0.1)"),
    ],
    [
      html.span(
        [attr.style("font-weight", "bold"), attr.style("color", "#4ade80")],
        [
          html.text("Score: " <> int.to_string(model.score)),
        ],
      ),
      html.span([attr.style("color", "#f87171")], [
        html.text("Health: " <> int.to_string(model.health)),
      ]),
      html.span(
        [attr.style("color", "#fbbf24"), attr.style("font-weight", "bold")],
        [
          html.text(model.status_msg),
        ],
      ),
      html.button(
        [
          attr.class("icon-btn"),
          attr.style("padding", "3px 10px"),
          attr.style("background", "#3b82f6"),
          attr.style("color", "white"),
          attr.style("border", "none"),
          attr.style("border-radius", "4px"),
          attr.style("cursor", "pointer"),
          event.on_click(ResetGame),
        ],
        [html.text("Restart")],
      ),
    ],
  )
}

fn view_controls(model: Model) -> Element(Msg) {
  html.div(
    [
      attr.class("controls"),
      attr.style("position", "absolute"),
      attr.style("bottom", "20px"),
      attr.style("right", "20px"),
      attr.style("z-index", "10"),
      attr.style("background", "rgba(15, 23, 42, 0.85)"),
      attr.style("padding", "12px"),
      attr.style("border-radius", "8px"),
      attr.style("display", "flex"),
      attr.style("flex-direction", "column"),
      attr.style("gap", "8px"),
    ],
    [
      html.select(
        [
          attr.attribute("data-test-id", "drawing-select"),
          event.on_change(SelectDrawing),
          attr.style("padding", "4px 8px"),
          attr.style("border-radius", "4px"),
        ],
        list.flatten([
          list.map(dict.to_list(model.drawings), fn(pair) {
            let #(name, _) = pair
            html.option(
              [
                attr.value(name),
                attr.selected(name == model.active_drawing),
              ],
              name,
            )
          }),
          [
            html.option([attr.value("")], "+ New Drawing..."),
          ],
        ]),
      ),

      html.input([
        attr.type_("range"),
        attr.min("0"),
        attr.max("100"),
        attr.value(int.to_string(model.shape_slider)),
        attr.attribute("data-test-id", "shape-slider"),
        event.on_input(fn(val) {
          case int.parse(val) {
            Ok(n) -> SetShapeSlider(n)
            Error(_) -> SetShapeSlider(model.shape_slider)
          }
        }),
      ]),

      html.input([
        attr.type_("range"),
        attr.min("-2.0"),
        attr.max("2.0"),
        attr.step("0.1"),
        attr.value(float.to_string(model.speed)),
        attr.attribute("data-test-id", "speed-slider"),
        event.on_input(fn(val) {
          case float.parse(val) {
            Ok(s) -> SetSpeed(s)
            Error(_) -> SetSpeed(model.speed)
          }
        }),
      ]),
    ],
  )
}

fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> element.none()
    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Geometry Helpers: Extract & Query RenderPath Segments ──────────────────────

/// Extracts segment endpoints and quartile interpolated points, deduplicating shared vertices
fn extract_all_track_points(paths: List(render.RenderPath)) -> List(Point) {
  list.flat_map(paths, fn(rp) {
    case rp.points {
      [a, b, ..] -> [
        a,
        b,
        Point({ a.x +. b.x } /. 2.0, { a.y +. b.y } /. 2.0),
        Point(a.x *. 0.75 +. b.x *. 0.25, a.y *. 0.75 +. b.y *. 0.25),
        Point(a.x *. 0.25 +. b.x *. 0.75, a.y *. 0.25 +. b.y *. 0.75),
      ]
      [a] -> [a]
      [] -> []
    }
  })
  |> list.unique
}

/// Samples a new target point across the drawing while ensuring minimum jump distance
fn pick_target_from_paths(
  paths: List(render.RenderPath),
  seed: Int,
  current_pt: Point,
) -> Point {
  let pts = extract_all_track_points(paths)
  let far_pts =
    list.filter(pts, fn(p) {
      let dx = p.x -. current_pt.x
      let dy = p.y -. current_pt.y
      { dx *. dx +. dy *. dy } >. 10_000.0
    })

  let pool = case far_pts {
    [] -> pts
    _ -> far_pts
  }

  let len = list.length(pool)
  case len {
    0 -> Point(0.0, 0.0)
    _ -> {
      let raw_idx = { seed * 1_103_515_245 + 12_345 } % len
      let idx = case raw_idx < 0 {
        True -> 0 - raw_idx
        False -> raw_idx
      }
      case list.drop(pool, idx) |> list.first {
        Ok(pt) -> pt
        Error(_) -> Point(0.0, 0.0)
      }
    }
  }
}

/// Computes the minimum Euclidean distance from (wx, wy) to any active path segment
fn get_min_dist_to_segments(
  wx: Float,
  wy: Float,
  paths: List(render.RenderPath),
) -> Float {
  case paths {
    [] -> 0.0
    _ -> {
      list.fold(paths, 999_999.0, fn(acc_min, rp) {
        let d = case rp.points {
          [a, b, ..] -> point_to_segment_dist(wx, wy, a.x, a.y, b.x, b.y)
          [a] -> {
            let dx = wx -. a.x
            let dy = wy -. a.y
            float.square_root(dx *. dx +. dy *. dy) |> result.unwrap(9999.0)
          }
          [] -> 9999.0
        }
        case d <. acc_min {
          True -> d
          False -> acc_min
        }
      })
    }
  }
}

/// Computes the perpendicular distance from point (px, py) to line segment (x1, y1)-(x2, y2)
fn point_to_segment_dist(
  px: Float,
  py: Float,
  x1: Float,
  y1: Float,
  x2: Float,
  y2: Float,
) -> Float {
  let dx = x2 -. x1
  let dy = y2 -. y1
  let len_sq = dx *. dx +. dy *. dy
  let t = case len_sq == 0.0 {
    True -> 0.0
    False -> {
      let raw_t = { { px -. x1 } *. dx +. { py -. y1 } *. dy } /. len_sq
      float.max(0.0, float.min(1.0, raw_t))
    }
  }
  let proj_x = x1 +. t *. dx
  let proj_y = y1 +. t *. dy
  let dist_x = px -. proj_x
  let dist_y = py -. proj_y
  float.square_root(dist_x *. dist_x +. dist_y *. dist_y)
  |> result.unwrap(9999.0)
}

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
