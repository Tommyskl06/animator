//# sourceMappingURL=evaluator_test.mjs.map
import * as $dict from "../gleam_stdlib/gleam/dict.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $gleeunit from "../gleeunit/gleeunit.mjs";
import * as $builtins from "./builtins.mjs";
import * as $errors from "./errors.mjs";
import {
  OnLine,
  RecursionLimit,
  StepLimit,
  TypeError,
  UnboundVariable,
  EvalError$RecursionLimit$const,
} from "./errors.mjs";
import * as $evaluator from "./evaluator.mjs";
import { Builtin, Global, Local, VBool, VData, VFunc, VInt, VList } from "./evaluator.mjs";
import {
  Ok,
  Error,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  makeError,
  isEqual,
} from "./gleam.mjs";
import * as $limits from "./limits.mjs";
import * as $mutable_dict from "./mutable_dict.mjs";
import * as $parser from "./parser.mjs";

const FILEPATH = "test/evaluator_test.gleam";

export function main() {
  return $gleeunit.main();
}

function run(shape_slider, body) {
  let $ = $parser.parse_program(
    ("fn draw(shape_slider: Int) -> List(Path) {\n" + body) + "\n}",
    $builtins.global_frame(),
  );
  let program;
  if ($ instanceof Ok) {
    program = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      38,
      "run",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 1507,
        end: 1665,
        pattern_start: 1518,
        pattern_end: 1529
      }
    )
  }
  return $evaluator.run(
    "draw",
    listPrepend(new VInt(shape_slider), $List$Empty$const),
    program,
  );
}

function point(x, y) {
  return new VData(
    "Point",
    listPrepend(new VInt(x), listPrepend(new VInt(y), $List$Empty$const)),
  );
}

function trace_with(body, helpers) {
  let log = $mutable_dict.new$();
  let labels = () => {
    return $result.unwrap($mutable_dict.get(log, "labels"), $List$Empty$const);
  };
  let global = $builtins.global_frame();
  $mutable_dict.insert(
    global,
    "tick",
    new VFunc(
      new Builtin(
        "tick",
        2,
        (args) => {
          let label;
          let value$1;
          if (args instanceof $Empty) {
            throw makeError(
              "let_assert",
              FILEPATH,
              "evaluator_test",
              490,
              "trace_with",
              "Pattern match failed, no pattern matched the value.",
              {
                value: args,
                start: 17196,
                end: 17234,
                pattern_start: 17207,
                pattern_end: 17227
              }
            )
          } else {
            let $ = args.tail;
            if ($ instanceof $Empty) {
              throw makeError(
                "let_assert",
                FILEPATH,
                "evaluator_test",
                490,
                "trace_with",
                "Pattern match failed, no pattern matched the value.",
                {
                  value: args,
                  start: 17196,
                  end: 17234,
                  pattern_start: 17207,
                  pattern_end: 17227
                }
              )
            } else if ($.tail instanceof $Empty) {
              let $1 = args.head;
              if ($1 instanceof VInt) {
                value$1 = $.head;
                label = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH,
                  "evaluator_test",
                  490,
                  "trace_with",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: args,
                    start: 17196,
                    end: 17234,
                    pattern_start: 17207,
                    pattern_end: 17227
                  }
                )
              }
            } else {
              throw makeError(
                "let_assert",
                FILEPATH,
                "evaluator_test",
                490,
                "trace_with",
                "Pattern match failed, no pattern matched the value.",
                {
                  value: args,
                  start: 17196,
                  end: 17234,
                  pattern_start: 17207,
                  pattern_end: 17227
                }
              )
            }
          }
          $mutable_dict.insert(log, "labels", listPrepend(label, labels()));
          return new Ok(value$1);
        },
      ),
    ),
  );
  let $ = $parser.parse_program(
    (("fn draw(shape_slider: Int) -> List(Path) {\n" + body) + "\n}\n\n") + helpers,
    global,
  );
  let program;
  if ($ instanceof Ok) {
    program = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      496,
      "trace_with",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 17340,
        end: 17520,
        pattern_start: 17351,
        pattern_end: 17362
      }
    )
  }
  let value$1 = $evaluator.run(
    "draw",
    listPrepend(new VInt(7), $List$Empty$const),
    program,
  );
  return [value$1, $list.reverse(labels())];
}

function trace(body) {
  return trace_with(body, "");
}

function value(body) {
  return trace(body)[0];
}

export function list_literal_test() {
  let $ = value("[]");
  let $1 = new Ok(new VList($List$Empty$const));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      48,
      "list_literal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 1825, end: 1836 },
        right: { kind: "literal", value: $1, start: 1840, end: 1853 },
        start: 1818,
        end: 1853,
        expression_start: 1825
      }
    )
  }
  let $2 = value("[1, 2 + 3, True]");
  let $3 = new Ok(
    new VList(
      listPrepend(
        new VInt(1),
        listPrepend(
          new VInt(5),
          listPrepend(new VBool(true), $List$Empty$const),
        ),
      ),
    ),
  );
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      49,
      "list_literal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 1863, end: 1888 },
        right: { kind: "literal", value: $3, start: 1892, end: 1934 },
        start: 1856,
        end: 1934,
        expression_start: 1863
      }
    )
  }
  let $4 = value("[Point(1, 2), [3]]");
  let $5 = new Ok(
    new VList(
      listPrepend(
        point(1, 2),
        listPrepend(
          new VList(listPrepend(new VInt(3), $List$Empty$const)),
          $List$Empty$const,
        ),
      ),
    ),
  );
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      50,
      "list_literal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 1944, end: 1971 },
        right: { kind: "expression", value: $5, start: 1979, end: 2021 },
        start: 1937,
        end: 2021,
        expression_start: 1944
      }
    )
  }
  return undefined;
}

export function shape_slider_is_bound_test() {
  let $ = run(1, "let r = 100 + shape_slider * 100\nr");
  let $1 = new Ok(new VInt(200));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      56,
      "shape_slider_is_bound_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 2128, end: 2173 },
        right: { kind: "literal", value: $1, start: 2177, end: 2190 },
        start: 2121,
        end: 2190,
        expression_start: 2128
      }
    )
  }
  return undefined;
}

export function field_access_test() {
  let $ = value("let a = Point(3, 4)\nPoint(a.x + 1, a.y * 2)");
  let $1 = new Ok(point(4, 8));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      61,
      "field_access_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 2302, end: 2355 },
        right: { kind: "expression", value: $1, start: 2363, end: 2378 },
        start: 2295,
        end: 2378,
        expression_start: 2302
      }
    )
  }
  return undefined;
}

export function field_access_nested_test() {
  let $ = value(
    "let l = Line(Point(3, 4), Point(5, 6))\n       let far = l.end\n       Point(far.x, l.start.y)",
  );
  let $1 = new Ok(point(5, 4));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      68,
      "field_access_nested_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 2549, end: 2663 },
        right: { kind: "expression", value: $1, start: 2671, end: 2686 },
        start: 2542,
        end: 2686,
        expression_start: 2549
      }
    )
  }
  return undefined;
}

export function field_access_wrong_type_test() {
  let $ = value("Line(Point(0, 0), Point(1, 1)).x");
  if ($ instanceof Error) {
    let $1 = $[0];
    if (!($1 instanceof OnLine && $1.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        80,
        "field_access_wrong_type_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 2925,
          end: 3014,
          pattern_start: 2936,
          pattern_end: 2966
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      80,
      "field_access_wrong_type_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 2925,
        end: 3014,
        pattern_start: 2936,
        pattern_end: 2966
      }
    )
  }
  let $2 = value("Point(1, 2).z");
  if ($2 instanceof Error) {
    let $3 = $2[0];
    if (!($3 instanceof OnLine && $3.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        83,
        "field_access_wrong_type_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $2,
          start: 3053,
          end: 3119,
          pattern_start: 3064,
          pattern_end: 3094
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      83,
      "field_access_wrong_type_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 3053,
        end: 3119,
        pattern_start: 3064,
        pattern_end: 3094
      }
    )
  }
  let $4 = value("shape_slider.x");
  if ($4 instanceof Error) {
    let $5 = $4[0];
    if (!($5 instanceof OnLine && $5.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        85,
        "field_access_wrong_type_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $4,
          start: 3162,
          end: 3229,
          pattern_start: 3173,
          pattern_end: 3203
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      85,
      "field_access_wrong_type_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $4,
        start: 3162,
        end: 3229,
        pattern_start: 3173,
        pattern_end: 3203
      }
    )
  }
  return $4;
}

export function case_on_comparison_test() {
  let body = "case shape_slider > 0 {\n      True -> 1\n      False -> 2\n    }";
  let $ = run(5, body);
  let $1 = new Ok(new VInt(1));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      95,
      "case_on_comparison_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 3423, end: 3435 },
        right: { kind: "literal", value: $1, start: 3439, end: 3450 },
        start: 3416,
        end: 3450,
        expression_start: 3423
      }
    )
  }
  let $2 = run(-5, body);
  let $3 = new Ok(new VInt(2));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      96,
      "case_on_comparison_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 3460, end: 3473 },
        right: { kind: "literal", value: $3, start: 3477, end: 3488 },
        start: 3453,
        end: 3488,
        expression_start: 3460
      }
    )
  }
  return undefined;
}

export function case_test() {
  let $ = run(0, "case True {\nTrue -> []\nFalse -> nope\n}");
  let $1 = new Ok(new VList($List$Empty$const));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      102,
      "case_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 3646, end: 3697 },
        right: { kind: "literal", value: $1, start: 3701, end: 3714 },
        start: 3639,
        end: 3714,
        expression_start: 3646
      }
    )
  }
  let $2 = run(0, "case nope {\n_ -> []\n}");
  if ($2 instanceof Error) {
    let $3 = $2[0];
    if ($3 instanceof OnLine) {
      let $4 = $3.error;
      if (!($4 instanceof UnboundVariable && $4.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          103,
          "case_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 3717,
            end: 3809,
            pattern_start: 3728,
            pattern_end: 3769
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        103,
        "case_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $2,
          start: 3717,
          end: 3809,
          pattern_start: 3728,
          pattern_end: 3769
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      103,
      "case_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 3717,
        end: 3809,
        pattern_start: 3728,
        pattern_end: 3769
      }
    )
  }
  let $5 = run(0, "case 1 {\n[] -> []\n}");
  if ($5 instanceof Error) {
    let $6 = $5[0];
    if (!($6 instanceof OnLine && $6.error instanceof $errors.NoMatchingCase)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        105,
        "case_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $5,
          start: 3812,
          end: 3900,
          pattern_start: 3823,
          pattern_end: 3862
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      105,
      "case_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $5,
        start: 3812,
        end: 3900,
        pattern_start: 3823,
        pattern_end: 3862
      }
    )
  }
  return $5;
}

function string_replace_slider(body, subject) {
  return $string.replace(body, "shape_slider", subject);
}

export function case_int_pattern_test() {
  let body = "case shape_slider {\n      0 -> 10\n      -1 -> 20\n      n -> n\n    }";
  let $ = value(body);
  let $1 = new Ok(new VInt(7));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      117,
      "case_int_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 4082, end: 4093 },
        right: { kind: "literal", value: $1, start: 4097, end: 4108 },
        start: 4075,
        end: 4108,
        expression_start: 4082
      }
    )
  }
  let $2 = value(string_replace_slider(body, "0"));
  let $3 = new Ok(new VInt(10));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      118,
      "case_int_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 4118, end: 4157 },
        right: { kind: "literal", value: $3, start: 4161, end: 4173 },
        start: 4111,
        end: 4173,
        expression_start: 4118
      }
    )
  }
  let $4 = value(string_replace_slider(body, "-1"));
  let $5 = new Ok(new VInt(20));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      119,
      "case_int_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 4183, end: 4223 },
        right: { kind: "literal", value: $5, start: 4227, end: 4239 },
        start: 4176,
        end: 4239,
        expression_start: 4183
      }
    )
  }
  let $6 = value("case 1 {\n0 -> 10\n}");
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if (!($7 instanceof OnLine && $7.error instanceof $errors.NoMatchingCase)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        120,
        "case_int_pattern_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 4242,
          end: 4328,
          pattern_start: 4253,
          pattern_end: 4292
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      120,
      "case_int_pattern_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 4242,
        end: 4328,
        pattern_start: 4253,
        pattern_end: 4292
      }
    )
  }
  let $8 = value("case True {\n1 -> 10\n}");
  if ($8 instanceof Error) {
    let $9 = $8[0];
    if (!($9 instanceof OnLine && $9.error instanceof $errors.NoMatchingCase)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        122,
        "case_int_pattern_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $8,
          start: 4331,
          end: 4420,
          pattern_start: 4342,
          pattern_end: 4381
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      122,
      "case_int_pattern_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $8,
        start: 4331,
        end: 4420,
        pattern_start: 4342,
        pattern_end: 4381
      }
    )
  }
  return $8;
}

export function short_circuit_test() {
  let $ = trace("tick(1, False) && tick(2, True)");
  let $1 = [new Ok(new VBool(false)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      132,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 4642, end: 4682 },
        right: { kind: "literal", value: $1, start: 4686, end: 4710 },
        start: 4635,
        end: 4710,
        expression_start: 4642
      }
    )
  }
  let $2 = trace("tick(1, True) && tick(2, False)");
  let $3 = [
    new Ok(new VBool(false)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      133,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 4720, end: 4760 },
        right: { kind: "literal", value: $3, start: 4764, end: 4791 },
        start: 4713,
        end: 4791,
        expression_start: 4720
      }
    )
  }
  let $4 = trace("tick(1, True) && tick(2, True)");
  let $5 = [
    new Ok(new VBool(true)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      134,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 4801, end: 4840 },
        right: { kind: "literal", value: $5, start: 4844, end: 4870 },
        start: 4794,
        end: 4870,
        expression_start: 4801
      }
    )
  }
  let $6 = trace("tick(1, True) || tick(2, False)");
  let $7 = [new Ok(new VBool(true)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      135,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 4880, end: 4920 },
        right: { kind: "literal", value: $7, start: 4924, end: 4947 },
        start: 4873,
        end: 4947,
        expression_start: 4880
      }
    )
  }
  let $8 = trace("tick(1, False) || tick(2, True)");
  let $9 = [
    new Ok(new VBool(true)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($8, $9))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      136,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $8, start: 4957, end: 4997 },
        right: { kind: "literal", value: $9, start: 5001, end: 5027 },
        start: 4950,
        end: 5027,
        expression_start: 4957
      }
    )
  }
  let $10 = trace("tick(1, False) || tick(2, False)");
  let $11 = [
    new Ok(new VBool(false)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($10, $11))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      137,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $10, start: 5037, end: 5078 },
        right: { kind: "literal", value: $11, start: 5086, end: 5113 },
        start: 5030,
        end: 5113,
        expression_start: 5037
      }
    )
  }
  let $12 = value("False && nope");
  let $13 = new Ok(new VBool(false));
  if (!(isEqual($12, $13))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      139,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $12, start: 5123, end: 5145 },
        right: { kind: "literal", value: $13, start: 5149, end: 5165 },
        start: 5116,
        end: 5165,
        expression_start: 5123
      }
    )
  }
  let $14 = value("True || nope");
  let $15 = new Ok(new VBool(true));
  if (!(isEqual($14, $15))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      140,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $14, start: 5175, end: 5196 },
        right: { kind: "literal", value: $15, start: 5200, end: 5215 },
        start: 5168,
        end: 5215,
        expression_start: 5175
      }
    )
  }
  let $16 = value("1 == 2 || 3 == 3 && 4 != 4");
  let $17 = new Ok(new VBool(false));
  if (!(isEqual($16, $17))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      142,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $16, start: 5296, end: 5331 },
        right: { kind: "literal", value: $17, start: 5335, end: 5351 },
        start: 5289,
        end: 5351,
        expression_start: 5296
      }
    )
  }
  let $18 = value("True || False && False");
  let $19 = new Ok(new VBool(true));
  if (!(isEqual($18, $19))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      143,
      "short_circuit_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $18, start: 5361, end: 5392 },
        right: { kind: "literal", value: $19, start: 5396, end: 5411 },
        start: 5354,
        end: 5411,
        expression_start: 5361
      }
    )
  }
  return undefined;
}

export function boolean_operator_type_errors_test() {
  let $ = value("1 && True");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof TypeError && $2.message === "&& expects two Bools")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          147,
          "boolean_operator_type_errors_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 5462,
            end: 5549,
            pattern_start: 5473,
            pattern_end: 5524
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        147,
        "boolean_operator_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 5462,
          end: 5549,
          pattern_start: 5473,
          pattern_end: 5524
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      147,
      "boolean_operator_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 5462,
        end: 5549,
        pattern_start: 5473,
        pattern_end: 5524
      }
    )
  }
  let $3 = value("True && 1");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof TypeError && $5.message === "&& expects two Bools")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          149,
          "boolean_operator_type_errors_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 5552,
            end: 5639,
            pattern_start: 5563,
            pattern_end: 5614
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        149,
        "boolean_operator_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 5552,
          end: 5639,
          pattern_start: 5563,
          pattern_end: 5614
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      149,
      "boolean_operator_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 5552,
        end: 5639,
        pattern_start: 5563,
        pattern_end: 5614
      }
    )
  }
  let $6 = value("1 || True");
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if ($7 instanceof OnLine) {
      let $8 = $7.error;
      if (!($8 instanceof TypeError && $8.message === "|| expects two Bools")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          151,
          "boolean_operator_type_errors_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $6,
            start: 5642,
            end: 5729,
            pattern_start: 5653,
            pattern_end: 5704
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        151,
        "boolean_operator_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 5642,
          end: 5729,
          pattern_start: 5653,
          pattern_end: 5704
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      151,
      "boolean_operator_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 5642,
        end: 5729,
        pattern_start: 5653,
        pattern_end: 5704
      }
    )
  }
  let $9 = value("False || 1");
  if ($9 instanceof Error) {
    let $10 = $9[0];
    if ($10 instanceof OnLine) {
      let $11 = $10.error;
      if (!($11 instanceof TypeError && $11.message === "|| expects two Bools")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          153,
          "boolean_operator_type_errors_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $9,
            start: 5732,
            end: 5820,
            pattern_start: 5743,
            pattern_end: 5794
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        153,
        "boolean_operator_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $9,
          start: 5732,
          end: 5820,
          pattern_start: 5743,
          pattern_end: 5794
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      153,
      "boolean_operator_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $9,
        start: 5732,
        end: 5820,
        pattern_start: 5743,
        pattern_end: 5794
      }
    )
  }
  return $9;
}

function ints(xs) {
  return new Ok(new VList($list.map(xs, (var0) => { return new VInt(var0); })));
}

export function list_prepend_test() {
  let $ = value("[1, ..[2, 3]]");
  let $1 = ints(
    listPrepend(1, listPrepend(2, listPrepend(3, $List$Empty$const))),
  );
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      159,
      "list_prepend_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 5937, end: 5959 },
        right: { kind: "expression", value: $1, start: 5963, end: 5978 },
        start: 5930,
        end: 5978,
        expression_start: 5937
      }
    )
  }
  let $2 = value("[1, 2, ..[3]]");
  let $3 = ints(
    listPrepend(1, listPrepend(2, listPrepend(3, $List$Empty$const))),
  );
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      160,
      "list_prepend_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 5988, end: 6010 },
        right: { kind: "expression", value: $3, start: 6014, end: 6029 },
        start: 5981,
        end: 6029,
        expression_start: 5988
      }
    )
  }
  let $4 = value("[1, ..[]]");
  let $5 = ints(listPrepend(1, $List$Empty$const));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      162,
      "list_prepend_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 6116, end: 6134 },
        right: { kind: "expression", value: $5, start: 6138, end: 6147 },
        start: 6109,
        end: 6147,
        expression_start: 6116
      }
    )
  }
  let $6 = value("[1, ..[2, ..[3]]]");
  let $7 = ints(
    listPrepend(1, listPrepend(2, listPrepend(3, $List$Empty$const))),
  );
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      163,
      "list_prepend_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 6157, end: 6183 },
        right: { kind: "expression", value: $7, start: 6187, end: 6202 },
        start: 6150,
        end: 6202,
        expression_start: 6157
      }
    )
  }
  return undefined;
}

export function helper_recursion_test() {
  let $ = run(
    0,
    "many(3)\n     }\n\n     fn many(n: Int) -> List(Int) {\n       case n > 0 {\n         True -> [n, ..many(n - 1)]\n         False -> []\n       }",
  );
  let $1 = ints(
    listPrepend(3, listPrepend(2, listPrepend(1, $List$Empty$const))),
  );
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      169,
      "helper_recursion_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 6360, end: 6526 },
        right: { kind: "expression", value: $1, start: 6534, end: 6549 },
        start: 6353,
        end: 6549,
        expression_start: 6360
      }
    )
  }
  return undefined;
}

export function non_tail_recursion_limit_test() {
  let $ = run(
    0,
    "let x = build(100000)\n       []\n     }\n\n     fn build(n: Int) -> List(Int) {\n       case n > 0 {\n         True -> [n, ..build(n - 1)]\n         False -> []\n       }",
  );
  if (!($ instanceof Error && $[0] instanceof RecursionLimit)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      185,
      "non_tail_recursion_limit_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 6671,
        end: 6902,
        pattern_start: 6682,
        pattern_end: 6703
      }
    )
  }
  return $;
}

export function runaway_append_step_limit_test() {
  let $ = run(
    0,
    "dbl([1], 40)\n     }\n\n     fn dbl(xs: List(Int), n: Int) -> List(Int) {\n       case n <= 0 {\n         True -> xs\n         False -> dbl(list.append(xs, xs), n - 1)\n       }",
  );
  if (!($ instanceof Error && $[0] instanceof StepLimit)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      206,
      "runaway_append_step_limit_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 7313,
        end: 7546,
        pattern_start: 7324,
        pattern_end: 7340
      }
    )
  }
  return $;
}

export function runaway_flatten_step_limit_test() {
  let $ = run(
    0,
    "let x = dbl([1], 17)\n       list.flatten([x, x])\n     }\n\n     fn dbl(xs: List(Int), n: Int) -> List(Int) {\n       case n <= 0 {\n         True -> xs\n         False -> dbl(list.append(xs, xs), n - 1)\n       }",
  );
  if (!($ instanceof Error && $[0] instanceof StepLimit)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      225,
      "runaway_flatten_step_limit_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 7881,
        end: 8150,
        pattern_start: 7892,
        pattern_end: 7908
      }
    )
  }
  return $;
}

export function branching_recursion_step_limit_test() {
  let $ = run(
    0,
    "fork(0)\n     }\n\n     fn fork(n: Int) -> List(Int) {\n       case n >= 40 {\n         True -> []\n         False -> list.append(fork(n + 1), fork(n + 1))\n       }",
  );
  if (!($ instanceof Error && $[0] instanceof StepLimit)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      243,
      "branching_recursion_step_limit_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 8336,
        end: 8557,
        pattern_start: 8347,
        pattern_end: 8363
      }
    )
  }
  return $;
}

export function deep_equality_recursion_limit_test() {
  let $ = run(
    0,
    "let deep = build(100000, [])\n       case deep == deep {\n         True -> []\n         False -> []\n       }\n     }\n\n     fn build(n: Int, acc: List(Int)) -> List(Int) {\n       case n <= 0 {\n         True -> acc\n         False -> build(n - 1, [acc])\n       }",
  );
  if (!($ instanceof Error && $[0] instanceof RecursionLimit)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      259,
      "deep_equality_recursion_limit_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 8684,
        end: 9007,
        pattern_start: 8695,
        pattern_end: 8716
      }
    )
  }
  return $;
}

export function unbound_variable_test() {
  let $ = run(0, "nope");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $1.line === 2 && $2.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          280,
          "unbound_variable_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 9169,
            end: 9238,
            pattern_start: 9180,
            pattern_end: 9221
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        280,
        "unbound_variable_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 9169,
          end: 9238,
          pattern_start: 9180,
          pattern_end: 9221
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      280,
      "unbound_variable_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 9169,
        end: 9238,
        pattern_start: 9180,
        pattern_end: 9221
      }
    )
  }
  return $;
}

export function bound_variable_test() {
  let $ = run(3, "shape_slider");
  let $1 = new Ok(new VInt(3));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      286,
      "bound_variable_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 9374, end: 9396 },
        right: { kind: "literal", value: $1, start: 9400, end: 9411 },
        start: 9367,
        end: 9411,
        expression_start: 9374
      }
    )
  }
  let $2 = run(0, "abs");
  if (!($2 instanceof Ok && $2[0] instanceof VFunc)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      287,
      "bound_variable_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 9414,
        end: 9453,
        pattern_start: 9425,
        pattern_end: 9437
      }
    )
  }
  return $2;
}

export function call_test() {
  let $ = run(0, "nope(1)");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $1.line === 2 && $2.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          294,
          "call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 9714,
            end: 9786,
            pattern_start: 9725,
            pattern_end: 9766
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        294,
        "call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 9714,
          end: 9786,
          pattern_start: 9725,
          pattern_end: 9766
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      294,
      "call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 9714,
        end: 9786,
        pattern_start: 9725,
        pattern_end: 9766
      }
    )
  }
  let $3 = run(0, "abs(nope)");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $4.line === 2 && $5.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          295,
          "call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 9789,
            end: 9863,
            pattern_start: 9800,
            pattern_end: 9841
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        295,
        "call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 9789,
          end: 9863,
          pattern_start: 9800,
          pattern_end: 9841
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      295,
      "call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 9789,
        end: 9863,
        pattern_start: 9800,
        pattern_end: 9841
      }
    )
  }
  let $6 = run(0, "1(2)");
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if (!($7 instanceof OnLine && $7.error instanceof TypeError && $7.line === 2)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        296,
        "call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 9866,
          end: 9924,
          pattern_start: 9877,
          pattern_end: 9907
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      296,
      "call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 9866,
        end: 9924,
        pattern_start: 9877,
        pattern_end: 9907
      }
    )
  }
  return $6;
}

export function builtin_step_limit_test() {
  let hungry = new VFunc(
    new Builtin(
      "hungry",
      1,
      (_) => {
        $limits.charge(1_000_000);
        return new Ok(new VInt(0));
      },
    ),
  );
  let $ = $limits.guarded(
    () => {
      return $evaluator.apply(
        hungry,
        listPrepend(new VInt(0), $List$Empty$const),
      );
    },
  );
  if (!($ instanceof Error && $[0] instanceof StepLimit)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      309,
      "builtin_step_limit_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 10205,
        end: 10298,
        pattern_start: 10216,
        pattern_end: 10232
      }
    )
  }
  return $;
}

export function error_line_test() {
  let $ = run(0, "let a = 1\nPoint(nope, nope)");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $1.line === 3 && $2.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          318,
          "error_line_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 10639,
            end: 10736,
            pattern_start: 10650,
            pattern_end: 10691
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        318,
        "error_line_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 10639,
          end: 10736,
          pattern_start: 10650,
          pattern_end: 10691
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      318,
      "error_line_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 10639,
        end: 10736,
        pattern_start: 10650,
        pattern_end: 10691
      }
    )
  }
  return $;
}

export function error_line_in_helper_test() {
  let $ = run(0, "bad(1)\n}\n\nfn bad(n: Int) -> Int {\n  n + missing");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!(
        $2 instanceof UnboundVariable &&
        $1.line === 6 &&
        $2.name === "missing"
      )) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          325,
          "error_line_in_helper_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 10922,
            end: 11045,
            pattern_start: 10933,
            pattern_end: 10977
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        325,
        "error_line_in_helper_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 10922,
          end: 11045,
          pattern_start: 10933,
          pattern_end: 10977
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      325,
      "error_line_in_helper_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 10922,
        end: 11045,
        pattern_start: 10933,
        pattern_end: 10977
      }
    )
  }
  return $;
}

export function error_line_in_lambda_test() {
  let $ = run(0, "list.map([1], fn(m) { m + missing })");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!(
        $2 instanceof UnboundVariable &&
        $1.line === 2 &&
        $2.name === "missing"
      )) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          332,
          "error_line_in_lambda_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 11214,
            end: 11322,
            pattern_start: 11225,
            pattern_end: 11269
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        332,
        "error_line_in_lambda_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 11214,
          end: 11322,
          pattern_start: 11225,
          pattern_end: 11269
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      332,
      "error_line_in_lambda_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 11214,
        end: 11322,
        pattern_start: 11225,
        pattern_end: 11269
      }
    )
  }
  return $;
}

export function error_message_line_test() {
  let $ = run(0, "list.map([1], fn(m) { m + missing })");
  let e;
  if ($ instanceof Error) {
    e = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      338,
      "error_message_line_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 11428,
        end: 11496,
        pattern_start: 11439,
        pattern_end: 11447
      }
    )
  }
  let $1 = $errors.error_message(e);
  let $2 = "unknown variable: missing on line 2";
  if (!($1 === $2)) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      339,
      "error_message_line_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $1, start: 11506, end: 11529 },
        right: { kind: "literal", value: $2, start: 11533, end: 11570 },
        start: 11499,
        end: 11570,
        expression_start: 11506
      }
    )
  }
  let $3 = $errors.error_message(EvalError$RecursionLimit$const);
  let $4 = "recursion too deep (missing base case?)";
  if (!($3 === $4)) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      340,
      "error_message_line_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $3, start: 11580, end: 11616 },
        right: { kind: "literal", value: $4, start: 11624, end: 11665 },
        start: 11573,
        end: 11665,
        expression_start: 11580
      }
    )
  }
  return undefined;
}

export function lambda_map_test() {
  let $ = value("list.map([1, 2, 3], fn(n) { n * 2 })");
  let $1 = ints(
    listPrepend(2, listPrepend(4, listPrepend(6, $List$Empty$const))),
  );
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      348,
      "lambda_map_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 11927, end: 11972 },
        right: { kind: "expression", value: $1, start: 11976, end: 11991 },
        start: 11920,
        end: 11991,
        expression_start: 11927
      }
    )
  }
  return undefined;
}

export function closure_captures_locals_test() {
  let $ = value("let k = 10\nlist.map([1, 2], fn(n) { n + k })");
  let $1 = ints(listPrepend(11, listPrepend(12, $List$Empty$const)));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      354,
      "closure_captures_locals_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 12181, end: 12235 },
        right: { kind: "expression", value: $1, start: 12243, end: 12257 },
        start: 12174,
        end: 12257,
        expression_start: 12181
      }
    )
  }
  return undefined;
}

export function closure_captures_slider_test() {
  let $ = run(7, "list.map([1], fn(n) { n * shape_slider })");
  let $1 = ints(listPrepend(7, $List$Empty$const));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      360,
      "closure_captures_slider_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 12349, end: 12400 },
        right: { kind: "expression", value: $1, start: 12404, end: 12413 },
        start: 12342,
        end: 12413,
        expression_start: 12349
      }
    )
  }
  return undefined;
}

function value_with(body, helpers) {
  return trace_with(body, helpers)[0];
}

export function named_function_as_value_test() {
  let $ = value_with(
    "list.map([1, 2], double)",
    "fn double(n: Int) -> Int { n * 2 }",
  );
  let $1 = ints(listPrepend(2, listPrepend(4, $List$Empty$const)));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      365,
      "named_function_as_value_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 12521, end: 12616 },
        right: { kind: "expression", value: $1, start: 12624, end: 12636 },
        start: 12514,
        end: 12636,
        expression_start: 12521
      }
    )
  }
  return undefined;
}

export function builtin_as_value_test() {
  let $ = value("list.map([-1, -2], abs)");
  let $1 = ints(listPrepend(1, listPrepend(2, $List$Empty$const)));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      374,
      "builtin_as_value_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 12737, end: 12769 },
        right: { kind: "expression", value: $1, start: 12773, end: 12785 },
        start: 12730,
        end: 12785,
        expression_start: 12737
      }
    )
  }
  return undefined;
}

export function function_capture_test() {
  let $ = value_with(
    "list.map([1, 2], add(10, _))",
    "fn add(a: Int, b: Int) -> Int { a + b }",
  );
  let $1 = ints(listPrepend(11, listPrepend(12, $List$Empty$const)));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      379,
      "function_capture_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 12896, end: 13000 },
        right: { kind: "expression", value: $1, start: 13008, end: 13022 },
        start: 12889,
        end: 13022,
        expression_start: 12896
      }
    )
  }
  return undefined;
}

export function function_in_let_test() {
  let $ = value("let f = fn(n) { n * 2 }\nf(4)");
  let $1 = new Ok(new VInt(8));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      388,
      "function_in_let_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 13139, end: 13177 },
        right: { kind: "literal", value: $1, start: 13181, end: 13192 },
        start: 13132,
        end: 13192,
        expression_start: 13139
      }
    )
  }
  return undefined;
}

export function discarded_lambda_param_test() {
  let $ = value("list.map([1, 2], fn(_n) { 5 })");
  let $1 = ints(listPrepend(5, listPrepend(5, $List$Empty$const)));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      393,
      "discarded_lambda_param_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 13311, end: 13350 },
        right: { kind: "expression", value: $1, start: 13354, end: 13366 },
        start: 13304,
        end: 13366,
        expression_start: 13311
      }
    )
  }
  let $2 = value("list.map([1, 2], fn(_n) { n })");
  if ($2 instanceof Error) {
    let $3 = $2[0];
    if ($3 instanceof OnLine) {
      let $4 = $3.error;
      if (!($4 instanceof UnboundVariable && $4.name === "n")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          394,
          "discarded_lambda_param_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 13369,
            end: 13464,
            pattern_start: 13380,
            pattern_end: 13418
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        394,
        "discarded_lambda_param_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $2,
          start: 13369,
          end: 13464,
          pattern_start: 13380,
          pattern_end: 13418
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      394,
      "discarded_lambda_param_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 13369,
        end: 13464,
        pattern_start: 13380,
        pattern_end: 13418
      }
    )
  }
  return $2;
}

export function list_builtins_test() {
  let $ = value("list.filter([1, 2, 3], fn(n) { n > 1 })");
  let $1 = ints(listPrepend(2, listPrepend(3, $List$Empty$const)));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      400,
      "list_builtins_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 13579, end: 13627 },
        right: { kind: "expression", value: $1, start: 13631, end: 13643 },
        start: 13572,
        end: 13643,
        expression_start: 13579
      }
    )
  }
  let $2 = value("list.append([1], [2, 3])");
  let $3 = ints(
    listPrepend(1, listPrepend(2, listPrepend(3, $List$Empty$const))),
  );
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      401,
      "list_builtins_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 13653, end: 13686 },
        right: { kind: "expression", value: $3, start: 13690, end: 13705 },
        start: 13646,
        end: 13705,
        expression_start: 13653
      }
    )
  }
  return undefined;
}

export function not_equal_test() {
  let $ = value("1 != 2");
  let $1 = new Ok(new VBool(true));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      406,
      "not_equal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 13793, end: 13808 },
        right: { kind: "literal", value: $1, start: 13812, end: 13827 },
        start: 13786,
        end: 13827,
        expression_start: 13793
      }
    )
  }
  let $2 = value("1 != 1");
  let $3 = new Ok(new VBool(false));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      407,
      "not_equal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 13837, end: 13852 },
        right: { kind: "literal", value: $3, start: 13856, end: 13872 },
        start: 13830,
        end: 13872,
        expression_start: 13837
      }
    )
  }
  let $4 = value("[1, 2] != [1, 2]");
  let $5 = new Ok(new VBool(false));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      408,
      "not_equal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 13882, end: 13907 },
        right: { kind: "literal", value: $5, start: 13911, end: 13927 },
        start: 13875,
        end: 13927,
        expression_start: 13882
      }
    )
  }
  let $6 = value("Point(1, 2) != Point(1, 3)");
  let $7 = new Ok(new VBool(true));
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      409,
      "not_equal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 13937, end: 13972 },
        right: { kind: "literal", value: $7, start: 13976, end: 13991 },
        start: 13930,
        end: 13991,
        expression_start: 13937
      }
    )
  }
  let $8 = value("1 != True");
  let $9 = new Ok(new VBool(true));
  if (!(isEqual($8, $9))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      410,
      "not_equal_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $8, start: 14001, end: 14019 },
        right: { kind: "literal", value: $9, start: 14023, end: 14038 },
        start: 13994,
        end: 14038,
        expression_start: 14001
      }
    )
  }
  return undefined;
}

export function list_length_test() {
  let $ = value("list.length([])");
  let $1 = new Ok(new VInt(0));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      414,
      "list_length_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 14079, end: 14103 },
        right: { kind: "literal", value: $1, start: 14107, end: 14118 },
        start: 14072,
        end: 14118,
        expression_start: 14079
      }
    )
  }
  let $2 = value("list.length([1, 2, 3])");
  let $3 = new Ok(new VInt(3));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      415,
      "list_length_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 14128, end: 14159 },
        right: { kind: "literal", value: $3, start: 14163, end: 14174 },
        start: 14121,
        end: 14174,
        expression_start: 14128
      }
    )
  }
  let $4 = value("list.length(1)");
  if ($4 instanceof Error) {
    let $5 = $4[0];
    if ($5 instanceof OnLine) {
      let $6 = $5.error;
      if (!(
        $6 instanceof TypeError &&
        $6.message === "list.length expects a list"
      )) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          416,
          "list_length_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $4,
            start: 14177,
            end: 14275,
            pattern_start: 14188,
            pattern_end: 14245
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        416,
        "list_length_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $4,
          start: 14177,
          end: 14275,
          pattern_start: 14188,
          pattern_end: 14245
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      416,
      "list_length_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $4,
        start: 14177,
        end: 14275,
        pattern_start: 14188,
        pattern_end: 14245
      }
    )
  }
  return $4;
}

export function unsupported_list_function_test() {
  let $ = value("list.sort([2, 1], compare)");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "list.sort")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          423,
          "unsupported_list_function_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 14477,
            end: 14576,
            pattern_start: 14488,
            pattern_end: 14534
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        423,
        "unsupported_list_function_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 14477,
          end: 14576,
          pattern_start: 14488,
          pattern_end: 14534
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      423,
      "unsupported_list_function_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 14477,
        end: 14576,
        pattern_start: 14488,
        pattern_end: 14534
      }
    )
  }
  let $3 = value("list.first([1])");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "list.first")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          425,
          "unsupported_list_function_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 14579,
            end: 14668,
            pattern_start: 14590,
            pattern_end: 14637
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        425,
        "unsupported_list_function_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 14579,
          end: 14668,
          pattern_start: 14590,
          pattern_end: 14637
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      425,
      "unsupported_list_function_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 14579,
        end: 14668,
        pattern_start: 14590,
        pattern_end: 14637
      }
    )
  }
  return $3;
}

export function error_inside_list_function_test() {
  let $ = value("list.map([1], fn(n) { n + nope })");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          432,
          "error_inside_list_function_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 14853,
            end: 14954,
            pattern_start: 14864,
            pattern_end: 14905
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        432,
        "error_inside_list_function_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 14853,
          end: 14954,
          pattern_start: 14864,
          pattern_end: 14905
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      432,
      "error_inside_list_function_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 14853,
        end: 14954,
        pattern_start: 14864,
        pattern_end: 14905
      }
    )
  }
  let $3 = value_with(
    "list.map([1], fn(n) { loop(n) })",
    "fn loop(n: Int) -> Int { loop(n + 1) }",
  );
  if (!($3 instanceof Error && $3[0] instanceof RecursionLimit)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      434,
      "error_inside_list_function_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 14957,
        end: 15103,
        pattern_start: 14968,
        pattern_end: 14989
      }
    )
  }
  return $3;
}

export function list_builtin_type_errors_test() {
  let $ = value("list.map(5, fn(n) { n })");
  if ($ instanceof Error) {
    let $1 = $[0];
    if (!($1 instanceof OnLine && $1.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        443,
        "list_builtin_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 15210,
          end: 15287,
          pattern_start: 15221,
          pattern_end: 15251
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      443,
      "list_builtin_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 15210,
        end: 15287,
        pattern_start: 15221,
        pattern_end: 15251
      }
    )
  }
  let $2 = value("list.map([1], 5)");
  if ($2 instanceof Error) {
    let $3 = $2[0];
    if (!($3 instanceof OnLine && $3.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        444,
        "list_builtin_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $2,
          start: 15290,
          end: 15359,
          pattern_start: 15301,
          pattern_end: 15331
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      444,
      "list_builtin_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 15290,
        end: 15359,
        pattern_start: 15301,
        pattern_end: 15331
      }
    )
  }
  let $4 = value("list.filter([1], fn(n) { n })");
  if ($4 instanceof Error) {
    let $5 = $4[0];
    if (!($5 instanceof OnLine && $5.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        446,
        "list_builtin_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $4,
          start: 15407,
          end: 15493,
          pattern_start: 15418,
          pattern_end: 15448
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      446,
      "list_builtin_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $4,
        start: 15407,
        end: 15493,
        pattern_start: 15418,
        pattern_end: 15448
      }
    )
  }
  let $6 = value("list.map([1], fn(a, b) { a + b })");
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if (!($7 instanceof OnLine && $7.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        449,
        "list_builtin_type_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 15560,
          end: 15650,
          pattern_start: 15571,
          pattern_end: 15601
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      449,
      "list_builtin_type_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 15560,
        end: 15650,
        pattern_start: 15571,
        pattern_end: 15601
      }
    )
  }
  return $6;
}

export function curried_call_test() {
  let $ = value_with("adder(10)(20)", "fn adder(a: Int) { fn(b) { a + b } }");
  let $1 = new Ok(new VInt(30));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      456,
      "curried_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 15814, end: 15881 },
        right: { kind: "literal", value: $1, start: 15889, end: 15901 },
        start: 15807,
        end: 15901,
        expression_start: 15814
      }
    )
  }
  return undefined;
}

export function call_non_function_test() {
  let $ = value("let f = 5\nf(2)");
  if ($ instanceof Error) {
    let $1 = $[0];
    if (!($1 instanceof OnLine && $1.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        463,
        "call_non_function_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 16082,
          end: 16150,
          pattern_start: 16093,
          pattern_end: 16123
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      463,
      "call_non_function_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 16082,
        end: 16150,
        pattern_start: 16093,
        pattern_end: 16123
      }
    )
  }
  let $2 = value("let abs = 5\nabs(2)");
  if ($2 instanceof Error) {
    let $3 = $2[0];
    if (!($3 instanceof OnLine && $3.error instanceof TypeError)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        464,
        "call_non_function_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $2,
          start: 16153,
          end: 16225,
          pattern_start: 16164,
          pattern_end: 16194
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      464,
      "call_non_function_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 16153,
        end: 16225,
        pattern_start: 16164,
        pattern_end: 16194
      }
    )
  }
  return $2;
}

export function call_evaluates_once_in_order_test() {
  let $ = trace("tick(1, 5)");
  let $1 = [new Ok(new VInt(5)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      529,
      "call_evaluates_once_in_order_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 18307, end: 18326 },
        right: { kind: "literal", value: $1, start: 18330, end: 18349 },
        start: 18300,
        end: 18349,
        expression_start: 18307
      }
    )
  }
  let $2 = trace("tick(1, abs)(tick(2, -3))");
  let $3 = [
    new Ok(new VInt(3)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      530,
      "call_evaluates_once_in_order_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 18359, end: 18393 },
        right: { kind: "literal", value: $3, start: 18397, end: 18419 },
        start: 18352,
        end: 18419,
        expression_start: 18359
      }
    )
  }
  let $4 = trace("tick(1, Point)(tick(2, 10), tick(3, 20))");
  let $5 = [
    new Ok(point(10, 20)),
    listPrepend(1, listPrepend(2, listPrepend(3, $List$Empty$const))),
  ];
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      531,
      "call_evaluates_once_in_order_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 18429, end: 18478 },
        right: { kind: "expression", value: $5, start: 18486, end: 18517 },
        start: 18422,
        end: 18517,
        expression_start: 18429
      }
    )
  }
  let $6 = value("10 - 3");
  let $7 = new Ok(new VInt(7));
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      533,
      "call_evaluates_once_in_order_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 18527, end: 18542 },
        right: { kind: "literal", value: $7, start: 18546, end: 18557 },
        start: 18520,
        end: 18557,
        expression_start: 18527
      }
    )
  }
  return undefined;
}

export function call_reports_first_error_test() {
  let $ = value("nope(1)");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          539,
          "call_reports_first_error_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 18758,
            end: 18829,
            pattern_start: 18769,
            pattern_end: 18810
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        539,
        "call_reports_first_error_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 18758,
          end: 18829,
          pattern_start: 18769,
          pattern_end: 18810
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      539,
      "call_reports_first_error_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 18758,
        end: 18829,
        pattern_start: 18769,
        pattern_end: 18810
      }
    )
  }
  let $3 = value("Point(1, nope)");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          540,
          "call_reports_first_error_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 18832,
            end: 18910,
            pattern_start: 18843,
            pattern_end: 18884
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        540,
        "call_reports_first_error_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 18832,
          end: 18910,
          pattern_start: 18843,
          pattern_end: 18884
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      540,
      "call_reports_first_error_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 18832,
        end: 18910,
        pattern_start: 18843,
        pattern_end: 18884
      }
    )
  }
  let $6 = value("Point(nope, 1)");
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if ($7 instanceof OnLine) {
      let $8 = $7.error;
      if (!($8 instanceof UnboundVariable && $8.name === "nope")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          541,
          "call_reports_first_error_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $6,
            start: 18913,
            end: 18991,
            pattern_start: 18924,
            pattern_end: 18965
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        541,
        "call_reports_first_error_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 18913,
          end: 18991,
          pattern_start: 18924,
          pattern_end: 18965
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      541,
      "call_reports_first_error_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 18913,
        end: 18991,
        pattern_start: 18924,
        pattern_end: 18965
      }
    )
  }
  let $9 = value("first(second)");
  if ($9 instanceof Error) {
    let $10 = $9[0];
    if ($10 instanceof OnLine) {
      let $11 = $10.error;
      if (!($11 instanceof UnboundVariable && $11.name === "first")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          542,
          "call_reports_first_error_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $9,
            start: 18994,
            end: 19072,
            pattern_start: 19005,
            pattern_end: 19047
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        542,
        "call_reports_first_error_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $9,
          start: 18994,
          end: 19072,
          pattern_start: 19005,
          pattern_end: 19047
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      542,
      "call_reports_first_error_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $9,
        start: 18994,
        end: 19072,
        pattern_start: 19005,
        pattern_end: 19047
      }
    )
  }
  let $12 = value("Point(first, second)");
  if ($12 instanceof Error) {
    let $13 = $12[0];
    if ($13 instanceof OnLine) {
      let $14 = $13.error;
      if (!($14 instanceof UnboundVariable && $14.name === "first")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          543,
          "call_reports_first_error_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $12,
            start: 19075,
            end: 19164,
            pattern_start: 19086,
            pattern_end: 19128
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        543,
        "call_reports_first_error_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $12,
          start: 19075,
          end: 19164,
          pattern_start: 19086,
          pattern_end: 19128
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      543,
      "call_reports_first_error_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $12,
        start: 19075,
        end: 19164,
        pattern_start: 19086,
        pattern_end: 19128
      }
    )
  }
  return $12;
}

export function list_and_field_evaluate_once_test() {
  let $ = trace("[tick(1, 1), tick(2, 2), ..tick(3, [4])]");
  let $1 = [
    new Ok(
      new VList(
        listPrepend(
          new VInt(1),
          listPrepend(new VInt(2), listPrepend(new VInt(4), $List$Empty$const)),
        ),
      ),
    ),
    listPrepend(1, listPrepend(2, listPrepend(3, $List$Empty$const))),
  ];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      549,
      "list_and_field_evaluate_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 19306, end: 19355 },
        right: { kind: "literal", value: $1, start: 19363, end: 19415 },
        start: 19299,
        end: 19415,
        expression_start: 19306
      }
    )
  }
  let $2 = trace("tick(1, Point(5, 6)).y");
  let $3 = [new Ok(new VInt(6)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      551,
      "list_and_field_evaluate_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 19425, end: 19456 },
        right: { kind: "literal", value: $3, start: 19460, end: 19479 },
        start: 19418,
        end: 19479,
        expression_start: 19425
      }
    )
  }
  return undefined;
}

export function pipe_evaluates_once_test() {
  let $ = trace("tick(1, -3) |> abs");
  let $1 = [new Ok(new VInt(3)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      556,
      "pipe_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 19608, end: 19635 },
        right: { kind: "literal", value: $1, start: 19639, end: 19658 },
        start: 19601,
        end: 19658,
        expression_start: 19608
      }
    )
  }
  let $2 = trace("tick(1, 3) |> Point(tick(2, 4))");
  let $3 = [
    new Ok(point(3, 4)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      557,
      "pipe_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 19668, end: 19708 },
        right: { kind: "expression", value: $3, start: 19712, end: 19738 },
        start: 19661,
        end: 19738,
        expression_start: 19668
      }
    )
  }
  return undefined;
}

export function let_evaluates_once_test() {
  let $ = trace("let x = tick(1, 5)\nx + x");
  let $1 = [new Ok(new VInt(10)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      563,
      "let_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 19916, end: 19950 },
        right: { kind: "literal", value: $1, start: 19954, end: 19974 },
        start: 19909,
        end: 19974,
        expression_start: 19916
      }
    )
  }
  let $2 = trace("let x = tick(1, 5)\n0");
  let $3 = [new Ok(new VInt(0)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      564,
      "let_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 19984, end: 20014 },
        right: { kind: "literal", value: $3, start: 20018, end: 20037 },
        start: 19977,
        end: 20037,
        expression_start: 19984
      }
    )
  }
  let $4 = trace("let x = 1\ntick(x, x)");
  let $5 = [new Ok(new VInt(1)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      565,
      "let_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 20047, end: 20077 },
        right: { kind: "literal", value: $5, start: 20081, end: 20100 },
        start: 20040,
        end: 20100,
        expression_start: 20047
      }
    )
  }
  let $6 = trace("let a = tick(1, 1)\nlet b = tick(2, 2)\nb - a");
  let $7 = [
    new Ok(new VInt(1)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      566,
      "let_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 20110, end: 20164 },
        right: { kind: "literal", value: $7, start: 20172, end: 20194 },
        start: 20103,
        end: 20194,
        expression_start: 20110
      }
    )
  }
  return undefined;
}

export function case_evaluates_subject_once_test() {
  let $ = trace("case tick(1, []) {\n[_] -> 1\n[_, _] -> 2\n[] -> 3\n}");
  let $1 = [new Ok(new VInt(3)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      572,
      "case_evaluates_subject_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 20323, end: 20385 },
        right: { kind: "literal", value: $1, start: 20393, end: 20412 },
        start: 20316,
        end: 20412,
        expression_start: 20323
      }
    )
  }
  return undefined;
}

export function case_evaluates_matching_arm_once_test() {
  let arms = " {\nTrue -> tick(1, 1)\nFalse -> tick(2, 2)\n_ -> tick(3, 3)\n}";
  let $ = trace("case True" + arms);
  let $1 = [new Ok(new VInt(1)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      579,
      "case_evaluates_matching_arm_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 20633, end: 20659 },
        right: { kind: "literal", value: $1, start: 20663, end: 20682 },
        start: 20626,
        end: 20682,
        expression_start: 20633
      }
    )
  }
  let $2 = trace("case False" + arms);
  let $3 = [new Ok(new VInt(2)), listPrepend(2, $List$Empty$const)];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      580,
      "case_evaluates_matching_arm_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 20692, end: 20719 },
        right: { kind: "literal", value: $3, start: 20723, end: 20742 },
        start: 20685,
        end: 20742,
        expression_start: 20692
      }
    )
  }
  let $4 = trace("case 0" + arms);
  let $5 = [new Ok(new VInt(3)), listPrepend(3, $List$Empty$const)];
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      581,
      "case_evaluates_matching_arm_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 20752, end: 20775 },
        right: { kind: "literal", value: $5, start: 20779, end: 20798 },
        start: 20745,
        end: 20798,
        expression_start: 20752
      }
    )
  }
  let $6 = trace("case 1 {\n[] -> tick(1, 1)\n}");
  let result = $6[0];
  let ticks = $6[1];
  if (result instanceof Error) {
    let $7 = result[0];
    if (!($7 instanceof OnLine && $7.error instanceof $errors.NoMatchingCase)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        583,
        "case_evaluates_matching_arm_once_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: result,
          start: 20865,
          end: 20924,
          pattern_start: 20876,
          pattern_end: 20915
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      583,
      "case_evaluates_matching_arm_once_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: result,
        start: 20865,
        end: 20924,
        pattern_start: 20876,
        pattern_end: 20915
      }
    )
  }
  let $8 = $List$Empty$const;
  if (!(isEqual(ticks, $8))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      584,
      "case_evaluates_matching_arm_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: ticks, start: 20934, end: 20939 },
        right: { kind: "literal", value: $8, start: 20943, end: 20945 },
        start: 20927,
        end: 20945,
        expression_start: 20934
      }
    )
  }
  return undefined;
}

export function variable_pattern_test() {
  let $ = value("case 5 {\nx -> x + 1\n}");
  let $1 = new Ok(new VInt(6));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      589,
      "variable_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 21065, end: 21097 },
        right: { kind: "literal", value: $1, start: 21101, end: 21112 },
        start: 21058,
        end: 21112,
        expression_start: 21065
      }
    )
  }
  let $2 = value("case [1, 2] {\nx -> x\n}");
  let $3 = new Ok(
    new VList(
      listPrepend(new VInt(1), listPrepend(new VInt(2), $List$Empty$const)),
    ),
  );
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      590,
      "variable_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 21122, end: 21155 },
        right: { kind: "literal", value: $3, start: 21159, end: 21188 },
        start: 21115,
        end: 21188,
        expression_start: 21122
      }
    )
  }
  let $4 = value("case True {\nFalse -> 0\nx -> 1\n}");
  let $5 = new Ok(new VInt(1));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      591,
      "variable_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 21198, end: 21241 },
        right: { kind: "literal", value: $5, start: 21245, end: 21256 },
        start: 21191,
        end: 21256,
        expression_start: 21198
      }
    )
  }
  return undefined;
}

export function list_pattern_test() {
  let $ = value("case [1, 2] {\n[a] -> a\n[a, b] -> a * 10 + b\n_ -> 0\n}");
  let $1 = new Ok(new VInt(12));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      597,
      "list_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 21438, end: 21503 },
        right: { kind: "literal", value: $1, start: 21511, end: 21523 },
        start: 21431,
        end: 21523,
        expression_start: 21438
      }
    )
  }
  let $2 = value("case [[], 1] {\n[first, _] -> first\n}");
  let $3 = new Ok(new VList($List$Empty$const));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      599,
      "list_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 21533, end: 21580 },
        right: { kind: "literal", value: $3, start: 21584, end: 21597 },
        start: 21526,
        end: 21597,
        expression_start: 21533
      }
    )
  }
  let $4 = value("case [1, 2, 3] {\n[a, b] -> a + b\n_ -> 0\n}");
  let $5 = new Ok(new VInt(0));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      600,
      "list_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 21607, end: 21660 },
        right: { kind: "literal", value: $5, start: 21664, end: 21675 },
        start: 21600,
        end: 21675,
        expression_start: 21607
      }
    )
  }
  let $6 = value("case [1, 2] {\n[True, b] -> b\n_ -> 0\n}");
  let $7 = new Ok(new VInt(0));
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      601,
      "list_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 21685, end: 21734 },
        right: { kind: "literal", value: $7, start: 21738, end: 21749 },
        start: 21678,
        end: 21749,
        expression_start: 21685
      }
    )
  }
  let $8 = value("case [1, 2] {\n[a, True] -> a\n_ -> 0\n}");
  let $9 = new Ok(new VInt(0));
  if (!(isEqual($8, $9))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      602,
      "list_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $8, start: 21759, end: 21808 },
        right: { kind: "literal", value: $9, start: 21812, end: 21823 },
        start: 21752,
        end: 21823,
        expression_start: 21759
      }
    )
  }
  let $10 = value("case [[1, 2], 3] {\n[[a, b], c] -> a * 100 + b * 10 + c\n}");
  let $11 = new Ok(new VInt(123));
  if (!(isEqual($10, $11))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      603,
      "list_pattern_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $10, start: 21833, end: 21900 },
        right: { kind: "literal", value: $11, start: 21908, end: 21921 },
        start: 21826,
        end: 21921,
        expression_start: 21833
      }
    )
  }
  return undefined;
}

export function list_pattern_rest_test() {
  let $ = value("case [1, 2, 3] {\n[a, ..rest] -> [a * 10, ..rest]\n}");
  let $1 = new Ok(
    new VList(
      listPrepend(
        new VInt(10),
        listPrepend(new VInt(2), listPrepend(new VInt(3), $List$Empty$const)),
      ),
    ),
  );
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      610,
      "list_pattern_rest_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 22089, end: 22150 },
        right: { kind: "literal", value: $1, start: 22158, end: 22197 },
        start: 22082,
        end: 22197,
        expression_start: 22089
      }
    )
  }
  let $2 = value("case [1] {\n[a, ..rest] -> rest\n}");
  let $3 = new Ok(new VList($List$Empty$const));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      612,
      "list_pattern_rest_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 22207, end: 22250 },
        right: { kind: "literal", value: $3, start: 22254, end: 22267 },
        start: 22200,
        end: 22267,
        expression_start: 22207
      }
    )
  }
  let $4 = value("case [] {\n[a, ..rest] -> 1\n_ -> 0\n}");
  let $5 = new Ok(new VInt(0));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      613,
      "list_pattern_rest_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 22277, end: 22324 },
        right: { kind: "literal", value: $5, start: 22328, end: 22339 },
        start: 22270,
        end: 22339,
        expression_start: 22277
      }
    )
  }
  let $6 = value(
    "case [True, 2, 3] {\n[False, ..rest] -> 0\n[True, b, ..rest] -> b\n}",
  );
  let $7 = new Ok(new VInt(2));
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      614,
      "list_pattern_rest_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 22349, end: 22439 },
        right: { kind: "literal", value: $7, start: 22447, end: 22458 },
        start: 22342,
        end: 22458,
        expression_start: 22349
      }
    )
  }
  return undefined;
}

export function user_function_evaluates_once_test() {
  let boom = "fn boom() -> Int { tick(1, 1) }";
  let $ = trace_with("double(tick(1, 3))", "fn double(n: Int) -> Int { n + n }");
  let $1 = [new Ok(new VInt(6)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      624,
      "user_function_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 22717, end: 22787 },
        right: { kind: "literal", value: $1, start: 22795, end: 22814 },
        start: 22710,
        end: 22814,
        expression_start: 22717
      }
    )
  }
  let $2 = trace_with("boom()", boom);
  let $3 = [new Ok(new VInt(1)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      626,
      "user_function_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 22824, end: 22850 },
        right: { kind: "literal", value: $3, start: 22854, end: 22873 },
        start: 22817,
        end: 22873,
        expression_start: 22824
      }
    )
  }
  let $4 = trace_with("tick(2, boom)()", boom);
  let $5 = [
    new Ok(new VInt(1)),
    listPrepend(2, listPrepend(1, $List$Empty$const)),
  ];
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      627,
      "user_function_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 22883, end: 22918 },
        right: { kind: "literal", value: $5, start: 22922, end: 22944 },
        start: 22876,
        end: 22944,
        expression_start: 22883
      }
    )
  }
  let $6 = trace_with("boom() + boom()", boom);
  let $7 = [
    new Ok(new VInt(2)),
    listPrepend(1, listPrepend(1, $List$Empty$const)),
  ];
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      628,
      "user_function_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 22954, end: 22989 },
        right: { kind: "literal", value: $7, start: 22993, end: 23015 },
        start: 22947,
        end: 23015,
        expression_start: 22954
      }
    )
  }
  let $8 = trace_with("let f = boom\n0", boom);
  let $9 = [new Ok(new VInt(0)), $List$Empty$const];
  if (!(isEqual($8, $9))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      629,
      "user_function_evaluates_once_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $8, start: 23025, end: 23060 },
        right: { kind: "literal", value: $9, start: 23064, end: 23082 },
        start: 23018,
        end: 23082,
        expression_start: 23025
      }
    )
  }
  return undefined;
}

export function lambda_body_evaluates_per_call_test() {
  let $ = trace("let f = fn(n) { tick(1, n) }\n0");
  let $1 = [new Ok(new VInt(0)), $List$Empty$const];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      634,
      "lambda_body_evaluates_per_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 23222, end: 23262 },
        right: { kind: "literal", value: $1, start: 23266, end: 23284 },
        start: 23215,
        end: 23284,
        expression_start: 23222
      }
    )
  }
  let $2 = value("let f = fn(n) { nope }\n0");
  let $3 = new Ok(new VInt(0));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      635,
      "lambda_body_evaluates_per_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 23294, end: 23328 },
        right: { kind: "literal", value: $3, start: 23332, end: 23343 },
        start: 23287,
        end: 23343,
        expression_start: 23294
      }
    )
  }
  let $4 = trace("let f = fn(n) { tick(n, n) }\nf(1) + f(2)");
  let $5 = [
    new Ok(new VInt(3)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      636,
      "lambda_body_evaluates_per_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 23353, end: 23403 },
        right: { kind: "literal", value: $5, start: 23411, end: 23433 },
        start: 23346,
        end: 23433,
        expression_start: 23353
      }
    )
  }
  let $6 = trace("fn(n) { tick(1, n) }(2)");
  let $7 = [new Ok(new VInt(2)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      638,
      "lambda_body_evaluates_per_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 23443, end: 23475 },
        right: { kind: "literal", value: $7, start: 23479, end: 23498 },
        start: 23436,
        end: 23498,
        expression_start: 23443
      }
    )
  }
  return undefined;
}

export function list_builtins_apply_once_per_element_test() {
  let $ = trace("list.map([1, 2, 3], fn(n) { tick(n, n) })");
  let $1 = [
    new Ok(
      new VList(
        listPrepend(
          new VInt(1),
          listPrepend(new VInt(2), listPrepend(new VInt(3), $List$Empty$const)),
        ),
      ),
    ),
    listPrepend(1, listPrepend(2, listPrepend(3, $List$Empty$const))),
  ];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      643,
      "list_builtins_apply_once_per_element_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 23627, end: 23677 },
        right: { kind: "literal", value: $1, start: 23685, end: 23737 },
        start: 23620,
        end: 23737,
        expression_start: 23627
      }
    )
  }
  let $2 = trace("list.filter([1, 2], fn(n) { tick(n, n > 1) })");
  let $3 = [
    new Ok(new VList(listPrepend(new VInt(2), $List$Empty$const))),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      645,
      "list_builtins_apply_once_per_element_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 23747, end: 23801 },
        right: { kind: "literal", value: $3, start: 23809, end: 23840 },
        start: 23740,
        end: 23840,
        expression_start: 23747
      }
    )
  }
  return undefined;
}

export function sugar_evaluates_per_call_test() {
  let $ = trace("let f = Point(tick(1, 0), _)\n0");
  let $1 = [new Ok(new VInt(0)), $List$Empty$const];
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      652,
      "sugar_evaluates_per_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 24061, end: 24101 },
        right: { kind: "literal", value: $1, start: 24105, end: 24123 },
        start: 24054,
        end: 24123,
        expression_start: 24061
      }
    )
  }
  let $2 = trace("let f = Point(tick(1, 0), _)\nf(5)");
  let $3 = [new Ok(point(0, 5)), listPrepend(1, $List$Empty$const)];
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      653,
      "sugar_evaluates_per_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 24133, end: 24176 },
        right: { kind: "expression", value: $3, start: 24180, end: 24203 },
        start: 24126,
        end: 24203,
        expression_start: 24133
      }
    )
  }
  let $4 = trace_with(
    "use x <- twice\ntick(x, x)",
    "fn twice(k: fn(Int) -> Int) -> Int { k(1) + k(2) }",
  );
  let $5 = [
    new Ok(new VInt(3)),
    listPrepend(1, listPrepend(2, $List$Empty$const)),
  ];
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      654,
      "sugar_evaluates_per_call_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 24213, end: 24326 },
        right: { kind: "literal", value: $5, start: 24334, end: 24356 },
        start: 24206,
        end: 24356,
        expression_start: 24213
      }
    )
  }
  return undefined;
}

export function lookup_finds_nearest_binding_test() {
  let global = $mutable_dict.new$();
  $mutable_dict.insert(global, "x", new VInt(0));
  $mutable_dict.insert(global, "y", new VInt(0));
  $mutable_dict.insert(global, "z", new VInt(0));
  let outer = new Local(
    $dict.from_list(
      listPrepend(
        ["x", new VInt(2)],
        listPrepend(["y", new VInt(2)], $List$Empty$const),
      ),
    ),
    new Global(global),
  );
  let inner = new Local(
    $dict.from_list(listPrepend(["x", new VInt(1)], $List$Empty$const)),
    outer,
  );
  let $ = $evaluator.lookup(inner, "x");
  let $1 = new Ok(new VInt(1));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      673,
      "lookup_finds_nearest_binding_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 25038, end: 25066 },
        right: { kind: "literal", value: $1, start: 25070, end: 25081 },
        start: 25031,
        end: 25081,
        expression_start: 25038
      }
    )
  }
  let $2 = $evaluator.lookup(inner, "y");
  let $3 = new Ok(new VInt(2));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      674,
      "lookup_finds_nearest_binding_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 25091, end: 25119 },
        right: { kind: "literal", value: $3, start: 25123, end: 25134 },
        start: 25084,
        end: 25134,
        expression_start: 25091
      }
    )
  }
  let $4 = $evaluator.lookup(inner, "z");
  let $5 = new Ok(new VInt(0));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      675,
      "lookup_finds_nearest_binding_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 25144, end: 25172 },
        right: { kind: "literal", value: $5, start: 25176, end: 25187 },
        start: 25137,
        end: 25187,
        expression_start: 25144
      }
    )
  }
  let $6 = $evaluator.lookup(outer, "x");
  let $7 = new Ok(new VInt(2));
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      676,
      "lookup_finds_nearest_binding_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 25197, end: 25225 },
        right: { kind: "literal", value: $7, start: 25229, end: 25240 },
        start: 25190,
        end: 25240,
        expression_start: 25197
      }
    )
  }
  return undefined;
}

export function lookup_unbound_name_test() {
  let outer = new Local($dict.new$(), new Global($mutable_dict.new$()));
  let inner = new Local(
    $dict.from_list(listPrepend(["x", new VInt(1)], $List$Empty$const)),
    outer,
  );
  let $ = $evaluator.lookup(outer, "x");
  let $1 = new Error(new UnboundVariable("x"));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      684,
      "lookup_unbound_name_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 25560, end: 25588 },
        right: { kind: "literal", value: $1, start: 25592, end: 25619 },
        start: 25553,
        end: 25619,
        expression_start: 25560
      }
    )
  }
  let $2 = $evaluator.lookup(inner, "w");
  let $3 = new Error(new UnboundVariable("w"));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      685,
      "lookup_unbound_name_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 25629, end: 25657 },
        right: { kind: "literal", value: $3, start: 25661, end: 25688 },
        start: 25622,
        end: 25688,
        expression_start: 25629
      }
    )
  }
  return undefined;
}

export function let_keeps_earlier_bindings_test() {
  let $ = value("let a = 1\nlet b = 2\nshape_slider * 100 + a * 10 + b");
  let $1 = new Ok(new VInt(712));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      690,
      "let_keeps_earlier_bindings_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 25809, end: 25871 },
        right: { kind: "literal", value: $1, start: 25879, end: 25892 },
        start: 25802,
        end: 25892,
        expression_start: 25809
      }
    )
  }
  return undefined;
}

export function let_rebinding_test() {
  let $ = value("let x = 1\nlet x = x + 1\nx");
  let $1 = new Ok(new VInt(2));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      697,
      "let_rebinding_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 26106, end: 26142 },
        right: { kind: "literal", value: $1, start: 26146, end: 26157 },
        start: 26099,
        end: 26157,
        expression_start: 26106
      }
    )
  }
  let $2 = value("let x = 1\nlet y = {\nlet x = 2\nx\n}\nx * 10 + y");
  let $3 = new Ok(new VInt(12));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      698,
      "let_rebinding_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 26167, end: 26225 },
        right: { kind: "literal", value: $3, start: 26233, end: 26245 },
        start: 26160,
        end: 26245,
        expression_start: 26167
      }
    )
  }
  return undefined;
}

export function let_scope_test() {
  let $ = value("let x = x\n0");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "x")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          704,
          "let_scope_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 26354,
            end: 26427,
            pattern_start: 26365,
            pattern_end: 26403
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        704,
        "let_scope_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 26354,
          end: 26427,
          pattern_start: 26365,
          pattern_end: 26403
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      704,
      "let_scope_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 26354,
        end: 26427,
        pattern_start: 26365,
        pattern_end: 26403
      }
    )
  }
  let $3 = value("let a = b\nlet b = 1\na");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "b")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          705,
          "let_scope_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 26430,
            end: 26518,
            pattern_start: 26441,
            pattern_end: 26479
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        705,
        "let_scope_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 26430,
          end: 26518,
          pattern_start: 26441,
          pattern_end: 26479
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      705,
      "let_scope_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 26430,
        end: 26518,
        pattern_start: 26441,
        pattern_end: 26479
      }
    )
  }
  let $6 = value("let a = {\nlet b = 1\nb\n}\nb");
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if ($7 instanceof OnLine) {
      let $8 = $7.error;
      if (!($8 instanceof UnboundVariable && $8.name === "b")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          707,
          "let_scope_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $6,
            start: 26521,
            end: 26615,
            pattern_start: 26532,
            pattern_end: 26570
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        707,
        "let_scope_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 26521,
          end: 26615,
          pattern_start: 26532,
          pattern_end: 26570
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      707,
      "let_scope_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 26521,
        end: 26615,
        pattern_start: 26532,
        pattern_end: 26570
      }
    )
  }
  return $6;
}

export function case_keeps_outer_bindings_test() {
  let $ = value(
    "let a = 1\ncase [2, 3] {\n[b, ..rest] -> shape_slider * 100 + a * 10 + b\n}",
  );
  let $1 = new Ok(new VInt(712));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      713,
      "case_keeps_outer_bindings_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 26754, end: 26851 },
        right: { kind: "literal", value: $1, start: 26859, end: 26872 },
        start: 26747,
        end: 26872,
        expression_start: 26754
      }
    )
  }
  return undefined;
}

export function case_pattern_shadowing_test() {
  let $ = value("let x = 1\nlet y = case 2 {\nx -> x\n}\nx * 10 + y");
  let $1 = new Ok(new VInt(12));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      721,
      "case_pattern_shadowing_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 26994, end: 27053 },
        right: { kind: "literal", value: $1, start: 27061, end: 27073 },
        start: 26987,
        end: 27073,
        expression_start: 26994
      }
    )
  }
  return undefined;
}

export function case_scope_test() {
  let $ = value("let y = case [1] {\n[b] -> b\n}\nb");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "b")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          728,
          "case_scope_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 27261,
            end: 27360,
            pattern_start: 27272,
            pattern_end: 27310
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        728,
        "case_scope_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 27261,
          end: 27360,
          pattern_start: 27272,
          pattern_end: 27310
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      728,
      "case_scope_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 27261,
        end: 27360,
        pattern_start: 27272,
        pattern_end: 27310
      }
    )
  }
  let $3 = value("case [1] {\n[a, True] -> a\n[_] -> a\n}");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "a")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          730,
          "case_scope_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 27363,
            end: 27467,
            pattern_start: 27374,
            pattern_end: 27412
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        730,
        "case_scope_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 27363,
          end: 27467,
          pattern_start: 27374,
          pattern_end: 27412
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      730,
      "case_scope_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 27363,
        end: 27467,
        pattern_start: 27374,
        pattern_end: 27412
      }
    )
  }
  let $6 = value("let y = case True {\n_ -> {\nlet z = 1\nz\n}\n}\nz");
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if ($7 instanceof OnLine) {
      let $8 = $7.error;
      if (!($8 instanceof UnboundVariable && $8.name === "z")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          732,
          "case_scope_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $6,
            start: 27470,
            end: 27585,
            pattern_start: 27481,
            pattern_end: 27519
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        732,
        "case_scope_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 27470,
          end: 27585,
          pattern_start: 27481,
          pattern_end: 27519
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      732,
      "case_scope_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 27470,
        end: 27585,
        pattern_start: 27481,
        pattern_end: 27519
      }
    )
  }
  return $6;
}

export function parameters_bind_in_order_test() {
  let $ = value_with("five()", "fn five() -> Int { 5 }");
  let $1 = new Ok(new VInt(5));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      738,
      "parameters_bind_in_order_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 27722, end: 27768 },
        right: { kind: "literal", value: $1, start: 27772, end: 27783 },
        start: 27715,
        end: 27783,
        expression_start: 27722
      }
    )
  }
  let $2 = value_with(
    "digits(1, 2, 3)",
    "fn digits(a: Int, b: Int, c: Int) -> Int { a * 100 + b * 10 + c }",
  );
  let $3 = new Ok(new VInt(123));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      739,
      "parameters_bind_in_order_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 27793, end: 27910 },
        right: { kind: "literal", value: $3, start: 27918, end: 27931 },
        start: 27786,
        end: 27931,
        expression_start: 27793
      }
    )
  }
  return undefined;
}

export function each_call_has_its_own_frame_test() {
  let $ = value_with(
    "sum(4)",
    "fn sum(n: Int) -> Int {\n         case n > 0 {\n           True -> {\n             let rest = sum(n - 1)\n             rest + n\n           }\n           False -> 0\n         }\n       }",
  );
  let $1 = new Ok(new VInt(10));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      749,
      "each_call_has_its_own_frame_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 28154, end: 28375 },
        right: { kind: "literal", value: $1, start: 28383, end: 28395 },
        start: 28147,
        end: 28395,
        expression_start: 28154
      }
    )
  }
  let $2 = value_with(
    "let a = same(1)\nlet b = same(2)\na * 10 + b",
    "fn same(n: Int) -> Int { n }",
  );
  let $3 = new Ok(new VInt(12));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      762,
      "each_call_has_its_own_frame_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 28405, end: 28514 },
        right: { kind: "literal", value: $3, start: 28522, end: 28534 },
        start: 28398,
        end: 28534,
        expression_start: 28405
      }
    )
  }
  return undefined;
}

export function call_keeps_caller_bindings_test() {
  let $ = value_with(
    "let x = 1\nlet y = bind_x(2) + let_x()\nx * 100 + y",
    "fn bind_x(x: Int) -> Int { x }\n       fn let_x() -> Int {\n         let x = 3\n         x\n       }",
  );
  let $1 = new Ok(new VInt(105));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      771,
      "call_keeps_caller_bindings_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 28676, end: 28860 },
        right: { kind: "literal", value: $1, start: 28868, end: 28881 },
        start: 28669,
        end: 28881,
        expression_start: 28676
      }
    )
  }
  return undefined;
}

export function function_cannot_see_caller_test() {
  let $ = value_with("let secret = 1\npeek()", "fn peek() -> Int { secret }");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "secret")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          785,
          "function_cannot_see_caller_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 29080,
            end: 29208,
            pattern_start: 29091,
            pattern_end: 29134
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        785,
        "function_cannot_see_caller_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 29080,
          end: 29208,
          pattern_start: 29091,
          pattern_end: 29134
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      785,
      "function_cannot_see_caller_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 29080,
        end: 29208,
        pattern_start: 29091,
        pattern_end: 29134
      }
    )
  }
  let $3 = value_with("peek()", "fn peek() -> Int { shape_slider }");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "shape_slider")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          787,
          "function_cannot_see_caller_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 29211,
            end: 29335,
            pattern_start: 29222,
            pattern_end: 29271
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        787,
        "function_cannot_see_caller_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 29211,
          end: 29335,
          pattern_start: 29222,
          pattern_end: 29271
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      787,
      "function_cannot_see_caller_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 29211,
        end: 29335,
        pattern_start: 29222,
        pattern_end: 29271
      }
    )
  }
  let $6 = value_with(
    "let secret = 1\nmiddle()",
    "fn middle() -> Int { peek() }\n       fn peek() -> Int { secret }",
  );
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if ($7 instanceof OnLine) {
      let $8 = $7.error;
      if (!($8 instanceof UnboundVariable && $8.name === "secret")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          790,
          "function_cannot_see_caller_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $6,
            start: 29405,
            end: 29591,
            pattern_start: 29416,
            pattern_end: 29459
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        790,
        "function_cannot_see_caller_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 29405,
          end: 29591,
          pattern_start: 29416,
          pattern_end: 29459
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      790,
      "function_cannot_see_caller_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 29405,
        end: 29591,
        pattern_start: 29416,
        pattern_end: 29459
      }
    )
  }
  let $9 = value_with(
    "let double = 5\ntwo_doubled()",
    "fn two_doubled() -> Int { double(2) }\n       fn double(n: Int) -> Int { n * 2 }",
  );
  let $10 = new Ok(new VInt(4));
  if (!(isEqual($9, $10))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      797,
      "function_cannot_see_caller_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $9, start: 29681, end: 29826 },
        right: { kind: "literal", value: $10, start: 29834, end: 29845 },
        start: 29674,
        end: 29845,
        expression_start: 29681
      }
    )
  }
  return undefined;
}

export function function_names_do_not_outlive_call_test() {
  let helpers = "fn helper(param: Int) -> Int {\n       let local = param\n       local\n     }\n     fn peek_param() -> Int { param }\n     fn peek_local() -> Int { local }";
  let $ = value_with("let a = helper(1)\nparam", helpers);
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "param")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          815,
          "function_names_do_not_outlive_call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 30203,
            end: 30310,
            pattern_start: 30214,
            pattern_end: 30256
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        815,
        "function_names_do_not_outlive_call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 30203,
          end: 30310,
          pattern_start: 30214,
          pattern_end: 30256
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      815,
      "function_names_do_not_outlive_call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 30203,
        end: 30310,
        pattern_start: 30214,
        pattern_end: 30256
      }
    )
  }
  let $3 = value_with("let a = helper(1)\nlocal", helpers);
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "local")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          817,
          "function_names_do_not_outlive_call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 30313,
            end: 30420,
            pattern_start: 30324,
            pattern_end: 30366
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        817,
        "function_names_do_not_outlive_call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 30313,
          end: 30420,
          pattern_start: 30324,
          pattern_end: 30366
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      817,
      "function_names_do_not_outlive_call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 30313,
        end: 30420,
        pattern_start: 30324,
        pattern_end: 30366
      }
    )
  }
  let $6 = value_with("let a = helper(1)\npeek_param()", helpers);
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if ($7 instanceof OnLine) {
      let $8 = $7.error;
      if (!($8 instanceof UnboundVariable && $8.name === "param")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          819,
          "function_names_do_not_outlive_call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $6,
            start: 30423,
            end: 30537,
            pattern_start: 30434,
            pattern_end: 30476
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        819,
        "function_names_do_not_outlive_call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 30423,
          end: 30537,
          pattern_start: 30434,
          pattern_end: 30476
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      819,
      "function_names_do_not_outlive_call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 30423,
        end: 30537,
        pattern_start: 30434,
        pattern_end: 30476
      }
    )
  }
  let $9 = value_with("let a = helper(1)\npeek_local()", helpers);
  if ($9 instanceof Error) {
    let $10 = $9[0];
    if ($10 instanceof OnLine) {
      let $11 = $10.error;
      if (!($11 instanceof UnboundVariable && $11.name === "local")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          821,
          "function_names_do_not_outlive_call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $9,
            start: 30540,
            end: 30654,
            pattern_start: 30551,
            pattern_end: 30593
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        821,
        "function_names_do_not_outlive_call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $9,
          start: 30540,
          end: 30654,
          pattern_start: 30551,
          pattern_end: 30593
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      821,
      "function_names_do_not_outlive_call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $9,
        start: 30540,
        end: 30654,
        pattern_start: 30551,
        pattern_end: 30593
      }
    )
  }
  return $9;
}

export function parameter_hides_global_test() {
  let $ = value_with("show(3)", "fn show(abs: Int) -> Int { abs }");
  let $1 = new Ok(new VInt(3));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      827,
      "parameter_hides_global_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 30783, end: 30840 },
        right: { kind: "literal", value: $1, start: 30848, end: 30859 },
        start: 30776,
        end: 30859,
        expression_start: 30783
      }
    )
  }
  let $2 = value_with(
    "call(3, abs)",
    "fn call(n: Int, helper: fn(Int) -> Int) -> Int { helper(n) }\n       fn helper(n: Int) -> Int { n + 100 }",
  );
  let $3 = new Ok(new VInt(3));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      829,
      "parameter_hides_global_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 30869, end: 31022 },
        right: { kind: "literal", value: $3, start: 31030, end: 31041 },
        start: 30862,
        end: 31041,
        expression_start: 30869
      }
    )
  }
  return undefined;
}

export function mutual_recursion_test() {
  let $ = value_with(
    "even(5)",
    "fn even(n: Int) -> Bool {\n         case n == 0 {\n           True -> True\n           False -> odd(n - 1)\n         }\n       }\n       fn odd(n: Int) -> Bool {\n         case n == 0 {\n           True -> False\n           False -> even(n - 1)\n         }\n       }",
  );
  let $1 = new Ok(new VBool(false));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      840,
      "mutual_recursion_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 31238, end: 31537 },
        right: { kind: "literal", value: $1, start: 31545, end: 31561 },
        start: 31231,
        end: 31561,
        expression_start: 31238
      }
    )
  }
  return undefined;
}

export function closure_uses_defining_frame_test() {
  let $ = value_with(
    "let x = 1\ncall(fn() { x })",
    "fn call(f: fn() -> Int) -> Int {\n         let x = 2\n         f()\n       }",
  );
  let $1 = new Ok(new VInt(1));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      861,
      "closure_uses_defining_frame_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 31741, end: 31878 },
        right: { kind: "literal", value: $1, start: 31886, end: 31897 },
        start: 31734,
        end: 31897,
        expression_start: 31741
      }
    )
  }
  let $2 = value_with(
    "let x = 1\ncall(2, fn() { x })",
    "fn call(x: Int, f: fn() -> Int) -> Int { f() }",
  );
  let $3 = new Ok(new VInt(1));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      869,
      "closure_uses_defining_frame_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 31907, end: 32020 },
        right: { kind: "literal", value: $3, start: 32028, end: 32039 },
        start: 31900,
        end: 32039,
        expression_start: 31907
      }
    )
  }
  return undefined;
}

export function closure_cannot_see_caller_test() {
  let $ = value_with(
    "call(fn() { hidden })",
    "fn call(f: fn() -> Int) -> Int {\n         let hidden = 1\n         f()\n       }",
  );
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "hidden")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          878,
          "closure_cannot_see_caller_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 32164,
            end: 32361,
            pattern_start: 32175,
            pattern_end: 32218
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        878,
        "closure_cannot_see_caller_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 32164,
          end: 32361,
          pattern_start: 32175,
          pattern_end: 32218
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      878,
      "closure_cannot_see_caller_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 32164,
        end: 32361,
        pattern_start: 32175,
        pattern_end: 32218
      }
    )
  }
  let $3 = value_with(
    "call(1, fn() { hidden })",
    "fn call(hidden: Int, f: fn() -> Int) -> Int { f() }",
  );
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "hidden")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          886,
          "closure_cannot_see_caller_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 32364,
            end: 32537,
            pattern_start: 32375,
            pattern_end: 32418
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        886,
        "closure_cannot_see_caller_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 32364,
          end: 32537,
          pattern_start: 32375,
          pattern_end: 32418
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      886,
      "closure_cannot_see_caller_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 32364,
        end: 32537,
        pattern_start: 32375,
        pattern_end: 32418
      }
    )
  }
  return $3;
}

export function closure_sees_only_earlier_bindings_test() {
  let $ = value("let k = 1\nlet f = fn() { k }\nlet k = 2\nf() * 10 + k");
  let $1 = new Ok(new VInt(12));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      896,
      "closure_sees_only_earlier_bindings_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 32768, end: 32831 },
        right: { kind: "literal", value: $1, start: 32839, end: 32851 },
        start: 32761,
        end: 32851,
        expression_start: 32768
      }
    )
  }
  let $2 = value("let f = fn() { later }\nlet later = 1\nf()");
  if ($2 instanceof Error) {
    let $3 = $2[0];
    if ($3 instanceof OnLine) {
      let $4 = $3.error;
      if (!($4 instanceof UnboundVariable && $4.name === "later")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          898,
          "closure_sees_only_earlier_bindings_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 32854,
            end: 32965,
            pattern_start: 32865,
            pattern_end: 32907
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        898,
        "closure_sees_only_earlier_bindings_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $2,
          start: 32854,
          end: 32965,
          pattern_start: 32865,
          pattern_end: 32907
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      898,
      "closure_sees_only_earlier_bindings_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 32854,
        end: 32965,
        pattern_start: 32865,
        pattern_end: 32907
      }
    )
  }
  let $5 = value("let f = fn(n) { f(n) }\nf(1)");
  if ($5 instanceof Error) {
    let $6 = $5[0];
    if ($6 instanceof OnLine) {
      let $7 = $6.error;
      if (!($7 instanceof UnboundVariable && $7.name === "f")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          900,
          "closure_sees_only_earlier_bindings_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $5,
            start: 32968,
            end: 33061,
            pattern_start: 32979,
            pattern_end: 33017
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        900,
        "closure_sees_only_earlier_bindings_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $5,
          start: 32968,
          end: 33061,
          pattern_start: 32979,
          pattern_end: 33017
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      900,
      "closure_sees_only_earlier_bindings_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $5,
        start: 32968,
        end: 33061,
        pattern_start: 32979,
        pattern_end: 33017
      }
    )
  }
  return $5;
}

export function closures_are_independent_test() {
  let $ = value_with(
    "let a = adder(1)\nlet b = adder(10)\na(100) + b(200) + a(1000)",
    "fn adder(k: Int) -> fn(Int) -> Int { fn(n) { n + k } }",
  );
  let $1 = new Ok(new VInt(1312));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      906,
      "closures_are_independent_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 33198, end: 33351 },
        right: { kind: "literal", value: $1, start: 33359, end: 33373 },
        start: 33191,
        end: 33373,
        expression_start: 33198
      }
    )
  }
  return undefined;
}

export function closure_sees_every_enclosing_frame_test() {
  let $ = value(
    "let f = fn(a) { fn(b) { fn(c) { shape_slider * 1000 + a * 100 + b * 10 + c } } }\n       f(1)(2)(3)",
  );
  let $1 = new Ok(new VInt(7123));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      915,
      "closure_sees_every_enclosing_frame_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 33523, end: 33643 },
        right: { kind: "literal", value: $1, start: 33651, end: 33665 },
        start: 33516,
        end: 33665,
        expression_start: 33523
      }
    )
  }
  let $2 = value("let f = case [5] {\n[x] -> fn(y) { x + y }\n}\nf(1)");
  let $3 = new Ok(new VInt(6));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      920,
      "closure_sees_every_enclosing_frame_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 33675, end: 33735 },
        right: { kind: "literal", value: $3, start: 33743, end: 33754 },
        start: 33668,
        end: 33754,
        expression_start: 33675
      }
    )
  }
  return undefined;
}

export function lambda_shadowing_test() {
  let $ = value("let x = 1\nlet f = fn(x) { x + 1 }\nf(5) * 10 + x");
  let $1 = new Ok(new VInt(61));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      927,
      "lambda_shadowing_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 33966, end: 34024 },
        right: { kind: "literal", value: $1, start: 34032, end: 34044 },
        start: 33959,
        end: 34044,
        expression_start: 33966
      }
    )
  }
  let $2 = value("let x = 1\nlet f = fn() {\nlet x = 2\nx\n}\nf() * 10 + x");
  let $3 = new Ok(new VInt(21));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      929,
      "lambda_shadowing_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 34054, end: 34119 },
        right: { kind: "literal", value: $3, start: 34127, end: 34139 },
        start: 34047,
        end: 34139,
        expression_start: 34054
      }
    )
  }
  return undefined;
}

export function lambda_recursion_has_own_frames_test() {
  let $ = value(
    "let sum = fn(self, n) {\n         case n > 0 {\n           True -> {\n             let rest = self(self, n - 1)\n             rest + n\n           }\n           False -> 0\n         }\n       }\n       sum(sum, 4)",
  );
  let $1 = new Ok(new VInt(10));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      935,
      "lambda_recursion_has_own_frames_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 34274, end: 34500 },
        right: { kind: "literal", value: $1, start: 34508, end: 34520 },
        start: 34267,
        end: 34520,
        expression_start: 34274
      }
    )
  }
  return undefined;
}

export function lambda_names_do_not_outlive_call_test() {
  let $ = value("let f = fn(inner) { inner }\nlet a = f(1)\ninner");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!($2 instanceof UnboundVariable && $2.name === "inner")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          953,
          "lambda_names_do_not_outlive_call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 34734,
            end: 34851,
            pattern_start: 34745,
            pattern_end: 34787
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        953,
        "lambda_names_do_not_outlive_call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 34734,
          end: 34851,
          pattern_start: 34745,
          pattern_end: 34787
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      953,
      "lambda_names_do_not_outlive_call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 34734,
        end: 34851,
        pattern_start: 34745,
        pattern_end: 34787
      }
    )
  }
  let $3 = value("let f = fn() {\nlet z = 1\nz\n}\nlet a = f()\nz");
  if ($3 instanceof Error) {
    let $4 = $3[0];
    if ($4 instanceof OnLine) {
      let $5 = $4.error;
      if (!($5 instanceof UnboundVariable && $5.name === "z")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          955,
          "lambda_names_do_not_outlive_call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $3,
            start: 34854,
            end: 34966,
            pattern_start: 34865,
            pattern_end: 34903
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        955,
        "lambda_names_do_not_outlive_call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $3,
          start: 34854,
          end: 34966,
          pattern_start: 34865,
          pattern_end: 34903
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      955,
      "lambda_names_do_not_outlive_call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 34854,
        end: 34966,
        pattern_start: 34865,
        pattern_end: 34903
      }
    )
  }
  let $6 = value(
    "let f = case [5] {\n[x] -> fn(y) { x + y }\n}\nlet a = f(1)\nx",
  );
  if ($6 instanceof Error) {
    let $7 = $6[0];
    if ($7 instanceof OnLine) {
      let $8 = $7.error;
      if (!($8 instanceof UnboundVariable && $8.name === "x")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          957,
          "lambda_names_do_not_outlive_call_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $6,
            start: 34969,
            end: 35096,
            pattern_start: 34980,
            pattern_end: 35018
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        957,
        "lambda_names_do_not_outlive_call_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $6,
          start: 34969,
          end: 35096,
          pattern_start: 34980,
          pattern_end: 35018
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      957,
      "lambda_names_do_not_outlive_call_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 34969,
        end: 35096,
        pattern_start: 34980,
        pattern_end: 35018
      }
    )
  }
  return $6;
}

export function use_scope_test() {
  let call = "fn call(k: fn(Int) -> Int) -> Int { k(1) }";
  let $ = value_with("let a = 10\nuse x <- call\na + x", call);
  let $1 = new Ok(new VInt(11));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      965,
      "use_scope_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 35328, end: 35380 },
        right: { kind: "literal", value: $1, start: 35384, end: 35396 },
        start: 35321,
        end: 35396,
        expression_start: 35328
      }
    )
  }
  let $2 = value_with("let y = {\nuse x <- call\nx\n}\nx", call);
  if ($2 instanceof Error) {
    let $3 = $2[0];
    if ($3 instanceof OnLine) {
      let $4 = $3.error;
      if (!($4 instanceof UnboundVariable && $4.name === "x")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          966,
          "use_scope_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 35399,
            end: 35508,
            pattern_start: 35410,
            pattern_end: 35448
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        966,
        "use_scope_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $2,
          start: 35399,
          end: 35508,
          pattern_start: 35410,
          pattern_end: 35448
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      966,
      "use_scope_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 35399,
        end: 35508,
        pattern_start: 35410,
        pattern_end: 35448
      }
    )
  }
  return $2;
}

export function capture_scope_test() {
  let $ = value_with(
    "let x = 5\ncall(Point(x, _))",
    "fn call(f: fn(Int) -> Point) -> Point {\n         let x = 6\n         f(1)\n       }",
  );
  let $1 = new Ok(point(5, 1));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      972,
      "capture_scope_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 35618, end: 35764 },
        right: { kind: "expression", value: $1, start: 35772, end: 35787 },
        start: 35611,
        end: 35787,
        expression_start: 35618
      }
    )
  }
  return undefined;
}

export function lambda_name_in_errors_test() {
  let $ = value("let f = fn(a) { a }\nf(1, 2)");
  if ($ instanceof Error) {
    let $1 = $[0];
    if ($1 instanceof OnLine) {
      let $2 = $1.error;
      if (!(
        $2 instanceof TypeError &&
        $2.message === "lambda takes 1 argument(s) but was given 2"
      )) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          984,
          "lambda_name_in_errors_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 35897,
            end: 36034,
            pattern_start: 35908,
            pattern_end: 35994
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        984,
        "lambda_name_in_errors_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 35897,
          end: 36034,
          pattern_start: 35908,
          pattern_end: 35994
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      984,
      "lambda_name_in_errors_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 35897,
        end: 36034,
        pattern_start: 35908,
        pattern_end: 35994
      }
    )
  }
  return $;
}

export function list_as_a_local_name_test() {
  let $ = value("let list = Point(1, 2)\nlist.x");
  let $1 = new Ok(new VInt(1));
  if (!(isEqual($, $1))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      993,
      "list_as_a_local_name_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $, start: 36256, end: 36295 },
        right: { kind: "literal", value: $1, start: 36299, end: 36310 },
        start: 36249,
        end: 36310,
        expression_start: 36256
      }
    )
  }
  let $2 = value("fn(list) { list.y }(Point(1, 2))");
  let $3 = new Ok(new VInt(2));
  if (!(isEqual($2, $3))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      994,
      "list_as_a_local_name_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $2, start: 36320, end: 36361 },
        right: { kind: "literal", value: $3, start: 36365, end: 36376 },
        start: 36313,
        end: 36376,
        expression_start: 36320
      }
    )
  }
  let $4 = value("case Point(1, 2) {\nlist -> list.x\n}");
  let $5 = new Ok(new VInt(1));
  if (!(isEqual($4, $5))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      995,
      "list_as_a_local_name_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $4, start: 36386, end: 36432 },
        right: { kind: "literal", value: $5, start: 36436, end: 36447 },
        start: 36379,
        end: 36447,
        expression_start: 36386
      }
    )
  }
  let $6 = value("let list = [1, -2]\nlist.map(list, abs)");
  let $7 = new Ok(
    new VList(
      listPrepend(new VInt(1), listPrepend(new VInt(2), $List$Empty$const)),
    ),
  );
  if (!(isEqual($6, $7))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      996,
      "list_as_a_local_name_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $6, start: 36457, end: 36505 },
        right: { kind: "literal", value: $7, start: 36513, end: 36542 },
        start: 36450,
        end: 36542,
        expression_start: 36457
      }
    )
  }
  let $8 = value("let list = Point(-1, 2)\nlist.map([list.x], abs)");
  let $9 = new Ok(new VList(listPrepend(new VInt(1), $List$Empty$const)));
  if (!(isEqual($8, $9))) {
    throw makeError(
      "assert",
      FILEPATH,
      "evaluator_test",
      998,
      "list_as_a_local_name_test",
      "Assertion failed.",
      {
        kind: "binary_operator",
        operator: "==",
        left: { kind: "expression", value: $8, start: 36552, end: 36609 },
        right: { kind: "literal", value: $9, start: 36617, end: 36637 },
        start: 36545,
        end: 36637,
        expression_start: 36552
      }
    )
  }
  let $10 = value("list.x");
  if ($10 instanceof Error) {
    let $11 = $10[0];
    if ($11 instanceof OnLine) {
      let $12 = $11.error;
      if (!($12 instanceof UnboundVariable && $12.name === "list")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          1000,
          "list_as_a_local_name_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $10,
            start: 36640,
            end: 36710,
            pattern_start: 36651,
            pattern_end: 36692
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        1000,
        "list_as_a_local_name_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $10,
          start: 36640,
          end: 36710,
          pattern_start: 36651,
          pattern_end: 36692
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      1000,
      "list_as_a_local_name_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $10,
        start: 36640,
        end: 36710,
        pattern_start: 36651,
        pattern_end: 36692
      }
    )
  }
  let $13 = value("let a = {\nlet list = Point(1, 2)\nlist.x\n}\nlist.x");
  if ($13 instanceof Error) {
    let $14 = $13[0];
    if ($14 instanceof OnLine) {
      let $15 = $14.error;
      if (!($15 instanceof UnboundVariable && $15.name === "list")) {
        throw makeError(
          "let_assert",
          FILEPATH,
          "evaluator_test",
          1001,
          "list_as_a_local_name_test",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $13,
            start: 36713,
            end: 36833,
            pattern_start: 36724,
            pattern_end: 36765
          }
        )
      }
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "evaluator_test",
        1001,
        "list_as_a_local_name_test",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $13,
          start: 36713,
          end: 36833,
          pattern_start: 36724,
          pattern_end: 36765
        }
      )
    }
  } else {
    throw makeError(
      "let_assert",
      FILEPATH,
      "evaluator_test",
      1001,
      "list_as_a_local_name_test",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $13,
        start: 36713,
        end: 36833,
        pattern_start: 36724,
        pattern_end: 36765
      }
    )
  }
  return $13;
}
