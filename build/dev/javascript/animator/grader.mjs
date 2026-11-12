//# sourceMappingURL=grader.mjs.map
import * as $dynamic from "../gleam_stdlib/gleam/dynamic.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $gleeunit from "../gleeunit/gleeunit.mjs";
import {
  Ok,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  isEqual,
} from "./gleam.mjs";
import { exit, source, rescue, supervise, args } from "./grader_ffi.mjs";

class Question extends $CustomType {
  constructor(name, points, checks) {
    super();
    this.name = name;
    this.points = points;
    this.checks = checks;
  }
}

class Check extends $CustomType {
  constructor(name, run, timed) {
    super();
    this.name = name;
    this.run = run;
    this.timed = timed;
  }
}

/**
 * One question: the name a student names it by (`gleam test -- q1`), what all
 * of its tests passing is worth, and those tests.
 */
export function question(name, points, checks) {
  return new Question(name, points, checks);
}

function discard_result(run) {
  return () => {
    let $ = run();
    
    return undefined;
  };
}

/**
 * One test of a question: the name to report it under, and the test function
 * itself. Its result is discarded, since a test function ends in whatever its
 * last assertion produced and that differs from test to test.
 */
export function check(name, run) {
  return new Check(name, discard_result(run), true);
}

/**
 * A test with no timeout, for one that is slow by design, such as one that
 * drives a real browser.
 */
export function untimed_check(name, run) {
  return new Check(name, discard_result(run), false);
}

function names(questions) {
  return $list.map(questions, (question) => { return question.name; });
}

function unknown(questions, selector) {
  $io.println(
    (("no question or test named " + selector) + "; this assignment has ") + $string.join(
      names(questions),
      ", ",
    ),
  );
  return exit(1);
}

function counted(n, of, unit) {
  let _block;
  if (of === 1) {
    _block = unit;
  } else {
    _block = unit + "s";
  }
  let plural = _block;
  return ((($int.to_string(n) + " of ") + $int.to_string(of)) + " ") + plural;
}

function hint(message) {
  let $ = $string.starts_with(message, "`todo` expression evaluated");
  if ($) {
    return "\nhint: Replace the `todo` at this line with your implementation.";
  } else {
    return "";
  }
}

function field(error, name, decoder) {
  let _pipe = $decode.run(
    error,
    $decode.at(listPrepend(name, $List$Empty$const), decoder),
  );
  return $result.replace_error(_pipe, undefined);
}

function code(error) {
  let snippet = $result.try$(
    field(error, "file", $decode.string),
    (file) => {
      return $result.try$(
        field(
          error,
          "left",
          $decode.at(listPrepend("start", $List$Empty$const), $decode.int),
        ),
        (start) => {
          return $result.try$(
            field(
              error,
              "left",
              $decode.at(listPrepend("end", $List$Empty$const), $decode.int),
            ),
            (end) => { return source(file, start, end); },
          );
        },
      );
    },
  );
  if (snippet instanceof Ok) {
    let snippet$1 = snippet[0];
    return "\ncode:     " + snippet$1;
  } else {
    return "";
  }
}

function describe(error) {
  let message = $result.unwrap(
    field(error, "message", $decode.string),
    "test failed",
  );
  let _block;
  let $ = field(error, "module", $decode.string);
  let $1 = field(error, "line", $decode.int);
  if ($ instanceof Ok && $1 instanceof Ok) {
    let module = $[0];
    let line$1 = $1[0];
    _block = (((" (" + module) + ":") + $int.to_string(line$1)) + ")";
  } else {
    _block = "";
  }
  let where = _block;
  let _block$1;
  let $2 = field(error, "value", $decode.dynamic);
  if ($2 instanceof Ok) {
    let value = $2[0];
    _block$1 = "\nvalue: " + $string.inspect(value);
  } else {
    _block$1 = "";
  }
  let value = _block$1;
  let _block$2;
  let $3 = field(
    error,
    "left",
    $decode.at(listPrepend("value", $List$Empty$const), $decode.dynamic),
  );
  let $4 = field(
    error,
    "right",
    $decode.at(listPrepend("value", $List$Empty$const), $decode.dynamic),
  );
  if ($3 instanceof Ok && $4 instanceof Ok) {
    let left = $3[0];
    let right = $4[0];
    _block$2 = (((code(error) + "\nexpected: ") + $string.inspect(right)) + "\nactual:   ") + $string.inspect(
      left,
    );
  } else {
    _block$2 = "";
  }
  let sides = _block$2;
  return (((message + where) + value) + sides) + hint(message);
}

function indent(message) {
  let _pipe = message;
  let _pipe$1 = $string.split(_pipe, "\n");
  let _pipe$2 = $list.map(_pipe$1, (line) => { return "        " + line; });
  return $string.join(_pipe$2, "\n");
}

function attempt(check) {
  let $ = check.timed;
  if ($) {
    return rescue(check.name, check.run);
  } else {
    return rescue("", check.run);
  }
}

function report(question) {
  $io.println(("\n" + question.name) + ":");
  let failed = $list.fold(
    question.checks,
    0,
    (failed, check) => {
      let $ = attempt(check);
      if ($ instanceof Ok) {
        $io.println("  pass  " + check.name);
        return failed;
      } else {
        let error = $[0];
        $io.println("  FAIL  " + check.name);
        $io.println(indent(describe(error)));
        return failed + 1;
      }
    },
  );
  let total = $list.length(question.checks);
  $io.println(("  " + counted(total - failed, total, "test")) + " passed");
  return failed;
}

function single(questions, selector) {
  return $list.find_map(
    questions,
    (question) => {
      let _pipe = $list.find(
        question.checks,
        (check) => { return check.name === selector; },
      );
      return $result.map(
        _pipe,
        (check) => {
          return new Question(
            question.name,
            question.points,
            listPrepend(check, $List$Empty$const),
          );
        },
      );
    },
  );
}

function run(questions, selectors) {
  let failed = $list.fold(
    selectors,
    0,
    (failed, selector) => {
      let $ = $list.find(questions, (q) => { return q.name === selector; });
      if ($ instanceof Ok) {
        let question$1 = $[0];
        return failed + report(question$1);
      } else {
        let $1 = single(questions, selector);
        if ($1 instanceof Ok) {
          let question$1 = $1[0];
          return failed + report(question$1);
        } else {
          unknown(questions, selector);
          return failed;
        }
      }
    },
  );
  if (failed === 0) {
    return undefined;
  } else {
    let n = failed;
    $io.println(("\n" + $int.to_string(n)) + " test(s) failed");
    return exit(1);
  }
}

function pad(text, width) {
  return $string.pad_end(text + "  ", width + 2, " ");
}

function line(name, width, passed, total, earned, points, graded) {
  let tests = counted(passed, total, "test");
  if (graded) {
    return (pad(name, width) + pad(tests, 20)) + counted(
      earned,
      points,
      "point",
    );
  } else {
    return pad(name, width) + tests;
  }
}

function score(questions) {
  let width = $list.fold(
    names(questions),
    5,
    (width, name) => { return $int.max(width, $string.length(name)); },
  );
  let graded = $list.fold(questions, 0, (sum, q) => { return sum + q.points; }) > 0;
  let totals = $list.fold(
    questions,
    [0, 0, 0, 0],
    (totals, question) => {
      let passed = $list.count(
        question.checks,
        (check) => { return isEqual(attempt(check), new Ok(undefined)); },
      );
      let total = $list.length(question.checks);
      let _block;
      let $ = passed === total;
      if ($) {
        _block = question.points;
      } else {
        _block = 0;
      }
      let earned = _block;
      $io.println(
        line(
          question.name,
          width,
          passed,
          total,
          earned,
          question.points,
          graded,
        ),
      );
      return [
        totals[0] + passed,
        totals[1] + total,
        totals[2] + earned,
        totals[3] + question.points,
      ];
    },
  );
  $io.println("");
  $io.println(
    line("total", width, totals[0], totals[1], totals[2], totals[3], graded),
  );
  let $ = totals[0] === totals[1];
  if ($) {
    return undefined;
  } else {
    return exit(1);
  }
}

function select(questions, selectors) {
  if (selectors instanceof $Empty) {
    return run(questions, selectors);
  } else if (selectors.tail instanceof $Empty) {
    let $ = selectors.head;
    if ($ === "score") {
      return score(questions);
    } else if ($ === "--score") {
      return score(questions);
    } else if ($ === "all") {
      return run(questions, names(questions));
    } else if ($ === "--all") {
      return run(questions, names(questions));
    } else {
      return run(questions, selectors);
    }
  } else {
    return run(questions, selectors);
  }
}

/**
 * The test entry point, which dispatches on what follows `gleam test --`.
 * With nothing after it, gleeunit runs the whole suite, exactly as it would
 * without this module.
 */
export function main(questions) {
  let $ = $list.filter(args(), (arg) => { return arg !== "--verbose"; });
  if ($ instanceof $Empty) {
    return $gleeunit.main();
  } else {
    let selectors = $;
    let $1 = supervise();
    if ($1) {
      return undefined;
    } else {
      return select(questions, selectors);
    }
  }
}
