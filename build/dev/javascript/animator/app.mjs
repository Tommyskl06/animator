//# sourceMappingURL=app.mjs.map
import * as $dict from "../gleam_stdlib/gleam/dict.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $data from "./data.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import {
  Ok,
  toList,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
  remainderInt,
  divideFloat,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $render from "./render.mjs";
import * as $shape from "./shape.mjs";
import { Point } from "./shape.mjs";

const FILEPATH = "src/app.gleam";

export class Model extends $CustomType {
  constructor(source, code_open, output, shape_slider, speed, active_drawing, drawings, score, health, game_over, cooldown_ticks, status_msg, target_pt, current_paths) {
    super();
    this.source = source;
    this.code_open = code_open;
    this.output = output;
    this.shape_slider = shape_slider;
    this.speed = speed;
    this.active_drawing = active_drawing;
    this.drawings = drawings;
    this.score = score;
    this.health = health;
    this.game_over = game_over;
    this.cooldown_ticks = cooldown_ticks;
    this.status_msg = status_msg;
    this.target_pt = target_pt;
    this.current_paths = current_paths;
  }
}
export const Model$Model = (source, code_open, output, shape_slider, speed, active_drawing, drawings, score, health, game_over, cooldown_ticks, status_msg, target_pt, current_paths) =>
  new Model(source,
  code_open,
  output,
  shape_slider,
  speed,
  active_drawing,
  drawings,
  score,
  health,
  game_over,
  cooldown_ticks,
  status_msg,
  target_pt,
  current_paths);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$source = (value) => value.source;
export const Model$Model$0 = (value) => value.source;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$1 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$2 = (value) => value.output;
export const Model$Model$shape_slider = (value) => value.shape_slider;
export const Model$Model$3 = (value) => value.shape_slider;
export const Model$Model$speed = (value) => value.speed;
export const Model$Model$4 = (value) => value.speed;
export const Model$Model$active_drawing = (value) => value.active_drawing;
export const Model$Model$5 = (value) => value.active_drawing;
export const Model$Model$drawings = (value) => value.drawings;
export const Model$Model$6 = (value) => value.drawings;
export const Model$Model$score = (value) => value.score;
export const Model$Model$7 = (value) => value.score;
export const Model$Model$health = (value) => value.health;
export const Model$Model$8 = (value) => value.health;
export const Model$Model$game_over = (value) => value.game_over;
export const Model$Model$9 = (value) => value.game_over;
export const Model$Model$cooldown_ticks = (value) => value.cooldown_ticks;
export const Model$Model$10 = (value) => value.cooldown_ticks;
export const Model$Model$status_msg = (value) => value.status_msg;
export const Model$Model$11 = (value) => value.status_msg;
export const Model$Model$target_pt = (value) => value.target_pt;
export const Model$Model$12 = (value) => value.target_pt;
export const Model$Model$current_paths = (value) => value.current_paths;
export const Model$Model$13 = (value) => value.current_paths;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

export class SetShapeSlider extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShapeSlider = ($0) => new SetShapeSlider($0);
export const Msg$isSetShapeSlider = (value) => value instanceof SetShapeSlider;
export const Msg$SetShapeSlider$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class SelectDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SelectDrawing = ($0) => new SelectDrawing($0);
export const Msg$isSelectDrawing = (value) => value instanceof SelectDrawing;
export const Msg$SelectDrawing$0 = (value) => value[0];

export class CreateDrawing extends $CustomType {}
export const Msg$CreateDrawing$const = new CreateDrawing();
export const Msg$CreateDrawing = () => Msg$CreateDrawing$const;
export const Msg$isCreateDrawing = (value) => value instanceof CreateDrawing;

export class UpdateMouseNorm extends $CustomType {
  constructor($0, $1) {
    super();
    this[0] = $0;
    this[1] = $1;
  }
}
export const Msg$UpdateMouseNorm = ($0, $1) => new UpdateMouseNorm($0, $1);
export const Msg$isUpdateMouseNorm = (value) =>
  value instanceof UpdateMouseNorm;
export const Msg$UpdateMouseNorm$0 = (value) => value[0];
export const Msg$UpdateMouseNorm$1 = (value) => value[1];

export class ResetGame extends $CustomType {}
export const Msg$ResetGame$const = new ResetGame();
export const Msg$ResetGame = () => Msg$ResetGame$const;
export const Msg$isResetGame = (value) => value instanceof ResetGame;

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0.0, 10.0, 2.0)]\n}\n";

export const public_url = "https://github.com/Tommyskl06/animator";

export const include_app_in_gallery = true;

export const video_url = "";

export const include_video_in_gallery = false;

/**
 * Extracts segment endpoints and quartile interpolated points, deduplicating shared vertices
 * 
 * @ignore
 */
function extract_all_track_points(paths) {
  let _pipe = $list.flat_map(
    paths,
    (rp) => {
      let $ = rp.points;
      if ($ instanceof $Empty) {
        return $;
      } else {
        let $1 = $.tail;
        if ($1 instanceof $Empty) {
          return $;
        } else {
          let a = $.head;
          let b = $1.head;
          return listPrepend(
            a,
            listPrepend(
              b,
              listPrepend(
                new Point((a.x + b.x) / 2.0, (a.y + b.y) / 2.0),
                listPrepend(
                  new Point(
                    (a.x * 0.75) + (b.x * 0.25),
                    (a.y * 0.75) + (b.y * 0.25),
                  ),
                  listPrepend(
                    new Point(
                      (a.x * 0.25) + (b.x * 0.75),
                      (a.y * 0.25) + (b.y * 0.75),
                    ),
                    $List$Empty$const,
                  ),
                ),
              ),
            ),
          );
        }
      }
    },
  );
  return $list.unique(_pipe);
}

/**
 * Samples a new target point across the drawing while ensuring minimum jump distance
 * 
 * @ignore
 */
function pick_target_from_paths(paths, seed, current_pt) {
  let pts = extract_all_track_points(paths);
  let far_pts = $list.filter(
    pts,
    (p) => {
      let dx = p.x - current_pt.x;
      let dy = p.y - current_pt.y;
      return ((dx * dx) + (dy * dy)) > 10000.0;
    },
  );
  let _block;
  if (far_pts instanceof $Empty) {
    _block = pts;
  } else {
    _block = far_pts;
  }
  let pool = _block;
  let len = $list.length(pool);
  if (len === 0) {
    return new Point(0.0, 0.0);
  } else {
    let raw_idx = remainderInt((seed * 1_103_515_245 + 12_345), len);
    let _block$1;
    let $ = raw_idx < 0;
    if ($) {
      _block$1 = 0 - raw_idx;
    } else {
      _block$1 = raw_idx;
    }
    let idx = _block$1;
    let $1 = (() => {
      let _pipe = $list.drop(pool, idx);
      return $list.first(_pipe);
    })();
    if ($1 instanceof Ok) {
      let pt = $1[0];
      return pt;
    } else {
      return new Point(0.0, 0.0);
    }
  }
}

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let _pipe = $drawing.try_draw(shape_slider, program);
    return $result.map_error(_pipe, $errors.error_message);
  } else {
    return $;
  }
}

function evaluate_and_render(shape_slider, source) {
  let $ = run_source(shape_slider, source);
  if ($ instanceof Ok) {
    let paths = $[0];
    let r_paths = $list.map(
      paths,
      (p) => { return $render.render_path(p, "#00ffff"); },
    );
    return [$string.inspect(paths), r_paths];
  } else {
    let msg = $[0];
    return [msg, $List$Empty$const];
  }
}

export function init(_) {
  let lib = $data.load_library();
  let _block;
  let $ = $dict.get(lib.drawings, lib.active);
  if ($ instanceof Ok) {
    let code = $[0];
    _block = code;
  } else {
    _block = default_code;
  }
  let current_source = _block;
  let $1 = evaluate_and_render(10, current_source);
  let initial_paths = $1[1];
  let first_target = pick_target_from_paths(
    initial_paths,
    1,
    new Point(0.0, 0.0),
  );
  return [
    new Model(
      current_source,
      true,
      "",
      10,
      1.0,
      lib.active,
      lib.drawings,
      0,
      3,
      false,
      0,
      "Follow cyan lines to collect gold dots!",
      first_target,
      initial_paths,
    ),
    $effect.batch(
      listPrepend(
        $editor.mount(current_source, (var0) => { return new SetCode(var0); }),
        listPrepend(
          $effect.from(
            (dispatch) => { return dispatch(new SetCode(current_source)); },
          ),
          $List$Empty$const,
        ),
      ),
    ),
  ];
}

/**
 * Computes the perpendicular distance from point (px, py) to line segment (x1, y1)-(x2, y2)
 * 
 * @ignore
 */
function point_to_segment_dist(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let len_sq = (dx * dx) + (dy * dy);
  let _block;
  let $ = len_sq === 0.0;
  if ($) {
    _block = 0.0;
  } else {
    let raw_t = divideFloat((((px - x1) * dx) + ((py - y1) * dy)), len_sq);
    _block = $float.max(0.0, $float.min(1.0, raw_t));
  }
  let t = _block;
  let proj_x = x1 + (t * dx);
  let proj_y = y1 + (t * dy);
  let dist_x = px - proj_x;
  let dist_y = py - proj_y;
  let _pipe = $float.square_root((dist_x * dist_x) + (dist_y * dist_y));
  return $result.unwrap(_pipe, 9999.0);
}

/**
 * Computes the minimum Euclidean distance from (wx, wy) to any active path segment
 * 
 * @ignore
 */
function get_min_dist_to_segments(wx, wy, paths) {
  if (paths instanceof $Empty) {
    return 0.0;
  } else {
    return $list.fold(
      paths,
      999999.0,
      (acc_min, rp) => {
        let _block;
        let $ = rp.points;
        if ($ instanceof $Empty) {
          _block = 9999.0;
        } else {
          let $1 = $.tail;
          if ($1 instanceof $Empty) {
            let a = $.head;
            let dx = wx - a.x;
            let dy = wy - a.y;
            let _pipe = $float.square_root((dx * dx) + (dy * dy));
            _block = $result.unwrap(_pipe, 9999.0);
          } else {
            let a = $.head;
            let b = $1.head;
            _block = point_to_segment_dist(wx, wy, a.x, a.y, b.x, b.y);
          }
        }
        let d = _block;
        let $1 = d < acc_min;
        if ($1) {
          return d;
        } else {
          return acc_min;
        }
      },
    );
  }
}

export function update(loop$model, loop$msg) {
  while (true) {
    let model = loop$model;
    let msg = loop$msg;
    if (msg instanceof SetCode) {
      let text = msg[0];
      let $ = evaluate_and_render(model.shape_slider, text);
      let output_text = $[0];
      let render_paths = $[1];
      $render.set_drawing(render_paths);
      let updated_drawings = $dict.insert(
        model.drawings,
        model.active_drawing,
        text,
      );
      let next_pt = pick_target_from_paths(
        render_paths,
        model.score + 1,
        model.target_pt,
      );
      let new_model = new Model(
        text,
        model.code_open,
        output_text,
        model.shape_slider,
        model.speed,
        model.active_drawing,
        updated_drawings,
        model.score,
        model.health,
        model.game_over,
        model.cooldown_ticks,
        model.status_msg,
        next_pt,
        render_paths,
      );
      $data.save_library(
        new $data.Library(new_model.active_drawing, updated_drawings),
      );
      return [new_model, $effect.none()];
    } else if (msg instanceof ToggleCode) {
      return [
        new Model(
          model.source,
          !model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.active_drawing,
          model.drawings,
          model.score,
          model.health,
          model.game_over,
          model.cooldown_ticks,
          model.status_msg,
          model.target_pt,
          model.current_paths,
        ),
        $effect.none(),
      ];
    } else if (msg instanceof SetShapeSlider) {
      let val = msg[0];
      let $ = evaluate_and_render(val, model.source);
      let output_text = $[0];
      let render_paths = $[1];
      $render.set_drawing(render_paths);
      let next_pt = pick_target_from_paths(
        render_paths,
        val + model.score,
        model.target_pt,
      );
      return [
        new Model(
          model.source,
          model.code_open,
          output_text,
          val,
          model.speed,
          model.active_drawing,
          model.drawings,
          model.score,
          model.health,
          model.game_over,
          model.cooldown_ticks,
          model.status_msg,
          next_pt,
          render_paths,
        ),
        $effect.none(),
      ];
    } else if (msg instanceof SetSpeed) {
      let spd = msg[0];
      $render.set_speed(spd);
      return [
        new Model(
          model.source,
          model.code_open,
          model.output,
          model.shape_slider,
          spd,
          model.active_drawing,
          model.drawings,
          model.score,
          model.health,
          model.game_over,
          model.cooldown_ticks,
          model.status_msg,
          model.target_pt,
          model.current_paths,
        ),
        $effect.none(),
      ];
    } else if (msg instanceof SelectDrawing) {
      let name = msg[0];
      if (name === "") {
        loop$model = model;
        loop$msg = Msg$CreateDrawing$const;
      } else {
        let $ = $dict.get(model.drawings, name);
        if ($ instanceof Ok) {
          let code = $[0];
          let $1 = evaluate_and_render(model.shape_slider, code);
          let output_text = $1[0];
          let render_paths = $1[1];
          $render.set_drawing(render_paths);
          let next_pt = pick_target_from_paths(render_paths, 7, model.target_pt);
          let new_model = new Model(
            code,
            model.code_open,
            output_text,
            model.shape_slider,
            model.speed,
            name,
            model.drawings,
            model.score,
            model.health,
            model.game_over,
            model.cooldown_ticks,
            model.status_msg,
            next_pt,
            render_paths,
          );
          $data.save_library(new $data.Library(name, model.drawings));
          return [
            new_model,
            $editor.mount(code, (var0) => { return new SetCode(var0); }),
          ];
        } else {
          return [model, $effect.none()];
        }
      }
    } else if (msg instanceof CreateDrawing) {
      let new_name = $data.prompt_drawing_name();
      if (new_name === "") {
        return [model, $effect.none()];
      } else {
        let updated_drawings = $dict.insert(
          model.drawings,
          new_name,
          default_code,
        );
        let $ = evaluate_and_render(model.shape_slider, default_code);
        let output_text = $[0];
        let render_paths = $[1];
        $render.set_drawing(render_paths);
        let next_pt = pick_target_from_paths(render_paths, 3, model.target_pt);
        let new_model = new Model(
          default_code,
          model.code_open,
          output_text,
          model.shape_slider,
          model.speed,
          new_name,
          updated_drawings,
          model.score,
          model.health,
          model.game_over,
          model.cooldown_ticks,
          model.status_msg,
          next_pt,
          render_paths,
        );
        $data.save_library(new $data.Library(new_name, updated_drawings));
        return [
          new_model,
          $editor.mount(default_code, (var0) => { return new SetCode(var0); }),
        ];
      }
    } else if (msg instanceof UpdateMouseNorm) {
      let norm_x = msg[0];
      let norm_y = msg[1];
      let $ = model.game_over;
      if ($) {
        return [model, $effect.none()];
      } else {
        let wx = (norm_x - 0.5) * 1000.0;
        let wy = (norm_y - 0.5) * 1000.0;
        let _block;
        let $1 = model.cooldown_ticks > 0;
        if ($1) {
          _block = model.cooldown_ticks - 1;
        } else {
          _block = 0;
        }
        let current_cd = _block;
        let dx = wx - model.target_pt.x;
        let dy = wy - model.target_pt.y;
        let hit_target = ((dx * dx) + (dy * dy)) <= 4900.0;
        let _block$1;
        if (hit_target) {
          let ns = model.score + 50;
          let pt = pick_target_from_paths(
            model.current_paths,
            ns + 13,
            model.target_pt,
          );
          _block$1 = [ns, pt, "✨ COLLECTED! (+50)"];
        } else {
          _block$1 = [model.score, model.target_pt, model.status_msg];
        }
        let $2 = _block$1;
        let new_score = $2[0];
        let next_pt = $2[1];
        let msg_collected = $2[2];
        let min_dist = get_min_dist_to_segments(wx, wy, model.current_paths);
        let is_inside_arena = (((norm_x > 0.05) && (norm_x < 0.95)) && (norm_y > 0.05)) && (norm_y < 0.95);
        let is_off_track = (min_dist > 95.0) && is_inside_arena;
        let _block$2;
        let $4 = is_off_track && (current_cd === 0);
        if ($4) {
          let nh = model.health - 1;
          let $5 = nh <= 0;
          if ($5) {
            _block$2 = [0, 0, "💥 GAME OVER!", true];
          } else {
            _block$2 = [nh, 35, "⚠️ OFF TRACK! (-1 HP)", false];
          }
        } else {
          _block$2 = [
            model.health,
            current_cd,
            msg_collected,
            model.health <= 0,
          ];
        }
        let $3 = _block$2;
        let final_health = $3[0];
        let final_cd = $3[1];
        let final_msg = $3[2];
        let is_dead = $3[3];
        return [
          new Model(
            model.source,
            model.code_open,
            model.output,
            model.shape_slider,
            model.speed,
            model.active_drawing,
            model.drawings,
            new_score,
            final_health,
            is_dead,
            final_cd,
            final_msg,
            next_pt,
            model.current_paths,
          ),
          $effect.none(),
        ];
      }
    } else {
      let next_pt = pick_target_from_paths(
        model.current_paths,
        5,
        model.target_pt,
      );
      return [
        new Model(
          model.source,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.active_drawing,
          model.drawings,
          0,
          3,
          false,
          0,
          "Game Reset! Follow the cyan lines.",
          next_pt,
          model.current_paths,
        ),
        $effect.none(),
      ];
    }
  }
}

function view_controls(model) {
  return $html.div(
    toList([
      $attr.class$("controls"),
      $attr.style("position", "absolute"),
      $attr.style("bottom", "20px"),
      $attr.style("right", "20px"),
      $attr.style("z-index", "10"),
      $attr.style("background", "rgba(15, 23, 42, 0.85)"),
      $attr.style("padding", "12px"),
      $attr.style("border-radius", "8px"),
      $attr.style("display", "flex"),
      $attr.style("flex-direction", "column"),
      $attr.style("gap", "8px"),
    ]),
    listPrepend(
      $html.select(
        listPrepend(
          $attr.attribute("data-test-id", "drawing-select"),
          listPrepend(
            $event.on_change((var0) => { return new SelectDrawing(var0); }),
            listPrepend(
              $attr.style("padding", "4px 8px"),
              listPrepend(
                $attr.style("border-radius", "4px"),
                $List$Empty$const,
              ),
            ),
          ),
        ),
        $list.flatten(
          listPrepend(
            $list.map(
              $dict.to_list(model.drawings),
              (pair) => {
                let name = pair[0];
                return $html.option(
                  listPrepend(
                    $attr.value(name),
                    listPrepend(
                      $attr.selected(name === model.active_drawing),
                      $List$Empty$const,
                    ),
                  ),
                  name,
                );
              },
            ),
            listPrepend(
              listPrepend(
                $html.option(
                  listPrepend($attr.value(""), $List$Empty$const),
                  "+ New Drawing...",
                ),
                $List$Empty$const,
              ),
              $List$Empty$const,
            ),
          ),
        ),
      ),
      listPrepend(
        $html.input(
          listPrepend(
            $attr.type_("range"),
            listPrepend(
              $attr.min("0"),
              listPrepend(
                $attr.max("100"),
                listPrepend(
                  $attr.value($int.to_string(model.shape_slider)),
                  listPrepend(
                    $attr.attribute("data-test-id", "shape-slider"),
                    listPrepend(
                      $event.on_input(
                        (val) => {
                          let $ = $int.parse(val);
                          if ($ instanceof Ok) {
                            let n = $[0];
                            return new SetShapeSlider(n);
                          } else {
                            return new SetShapeSlider(model.shape_slider);
                          }
                        },
                      ),
                      $List$Empty$const,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        listPrepend(
          $html.input(
            listPrepend(
              $attr.type_("range"),
              listPrepend(
                $attr.min("-2.0"),
                listPrepend(
                  $attr.max("2.0"),
                  listPrepend(
                    $attr.step("0.1"),
                    listPrepend(
                      $attr.value($float.to_string(model.speed)),
                      listPrepend(
                        $attr.attribute("data-test-id", "speed-slider"),
                        listPrepend(
                          $event.on_input(
                            (val) => {
                              let $ = $float.parse(val);
                              if ($ instanceof Ok) {
                                let s = $[0];
                                return new SetSpeed(s);
                              } else {
                                return new SetSpeed(model.speed);
                              }
                            },
                          ),
                          $List$Empty$const,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          $List$Empty$const,
        ),
      ),
    ),
  );
}

function view_game_stats(model) {
  return $html.div(
    toList([
      $attr.style("position", "absolute"),
      $attr.style("top", "10px"),
      $attr.style("right", "20px"),
      $attr.style("z-index", "10"),
      $attr.style("background", "rgba(15, 23, 42, 0.85)"),
      $attr.style("padding", "8px 14px"),
      $attr.style("border-radius", "6px"),
      $attr.style("color", "white"),
      $attr.style("font-size", "14px"),
      $attr.style("font-family", "sans-serif"),
      $attr.style("display", "flex"),
      $attr.style("align-items", "center"),
      $attr.style("gap", "12px"),
      $attr.style("border", "1px solid rgba(255, 255, 255, 0.1)"),
    ]),
    listPrepend(
      $html.span(
        listPrepend(
          $attr.style("font-weight", "bold"),
          listPrepend($attr.style("color", "#4ade80"), $List$Empty$const),
        ),
        listPrepend(
          $html.text("Score: " + $int.to_string(model.score)),
          $List$Empty$const,
        ),
      ),
      listPrepend(
        $html.span(
          listPrepend($attr.style("color", "#f87171"), $List$Empty$const),
          listPrepend(
            $html.text("Health: " + $int.to_string(model.health)),
            $List$Empty$const,
          ),
        ),
        listPrepend(
          $html.span(
            listPrepend(
              $attr.style("color", "#fbbf24"),
              listPrepend($attr.style("font-weight", "bold"), $List$Empty$const),
            ),
            listPrepend($html.text(model.status_msg), $List$Empty$const),
          ),
          listPrepend(
            $html.button(
              listPrepend(
                $attr.class$("icon-btn"),
                listPrepend(
                  $attr.style("padding", "3px 10px"),
                  listPrepend(
                    $attr.style("background", "#3b82f6"),
                    listPrepend(
                      $attr.style("color", "white"),
                      listPrepend(
                        $attr.style("border", "none"),
                        listPrepend(
                          $attr.style("border-radius", "4px"),
                          listPrepend(
                            $attr.style("cursor", "pointer"),
                            listPrepend(
                              $event.on_click(Msg$ResetGame$const),
                              $List$Empty$const,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              listPrepend($html.text("Restart"), $List$Empty$const),
            ),
            $List$Empty$const,
          ),
        ),
      ),
    ),
  );
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_anim(model) {
  let mouse_decoder = $decode.field(
    "offsetX",
    $decode.float,
    (ox) => {
      return $decode.field(
        "offsetY",
        $decode.float,
        (oy) => {
          return $decode.field(
            "target",
            $decode.field(
              "clientWidth",
              $decode.float,
              (w) => {
                return $decode.field(
                  "clientHeight",
                  $decode.float,
                  (h) => { return $decode.success([w, h]); },
                );
              },
            ),
            (target) => {
              let w = target[0];
              let h = target[1];
              let _block;
              let $ = w > 0.0;
              if ($) {
                _block = divideFloat(ox, w);
              } else {
                _block = 0.5;
              }
              let nx = _block;
              let _block$1;
              let $1 = h > 0.0;
              if ($1) {
                _block$1 = divideFloat(oy, h);
              } else {
                _block$1 = 0.5;
              }
              let ny = _block$1;
              return $decode.success(new UpdateMouseNorm(nx, ny));
            },
          );
        },
      );
    },
  );
  let left_pct = ((model.target_pt.x / 1000.0) + 0.5) * 100.0;
  let top_pct = ((model.target_pt.y / 1000.0) + 0.5) * 100.0;
  return $html.div(
    listPrepend(
      $attr.class$("canvas-area"),
      listPrepend($attr.style("position", "relative"), $List$Empty$const),
    ),
    listPrepend(
      view_reveal_code(model),
      listPrepend(
        view_game_stats(model),
        listPrepend(
          view_controls(model),
          listPrepend(
            $html.div(
              listPrepend(
                $attr.style("position", "relative"),
                listPrepend(
                  $attr.style("display", "inline-block"),
                  listPrepend(
                    $attr.style("line-height", "0"),
                    $List$Empty$const,
                  ),
                ),
              ),
              listPrepend(
                $html.canvas(
                  listPrepend(
                    $attr.id("animation-canvas"),
                    listPrepend(
                      $attr.class$("canvas"),
                      listPrepend(
                        $attr.style("pointer-events", "auto"),
                        listPrepend(
                          $attr.style("cursor", "crosshair"),
                          listPrepend(
                            $event.on("mousemove", mouse_decoder),
                            $List$Empty$const,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                listPrepend(
                  $html.div(
                    toList([
                      $attr.style("position", "absolute"),
                      $attr.style("left", $float.to_string(left_pct) + "%"),
                      $attr.style("top", $float.to_string(top_pct) + "%"),
                      $attr.style("transform", "translate(-50%, -50%)"),
                      $attr.style("width", "10px"),
                      $attr.style("height", "10px"),
                      $attr.style("background", "#ffd700"),
                      $attr.style("border-radius", "50%"),
                      $attr.style(
                        "box-shadow",
                        "0 0 8px #ffd700, 0 0 14px #ffae00",
                      ),
                      $attr.style("pointer-events", "none"),
                      $attr.style("z-index", "5"),
                    ]),
                    $List$Empty$const,
                  ),
                  $List$Empty$const,
                ),
              ),
            ),
            listPrepend(
              $html.pre(
                listPrepend($attr.class$("output"), $List$Empty$const),
                listPrepend($html.text(model.output), $List$Empty$const),
              ),
              $List$Empty$const,
            ),
          ),
        ),
      ),
    ),
  );
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend($editor.view_panel(Msg$ToggleCode$const), $List$Empty$const),
      ),
      listPrepend(view_anim(model), $List$Empty$const),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      680,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 19906,
        end: 19955,
        pattern_start: 19917,
        pattern_end: 19922
      }
    )
  }
  return undefined;
}
