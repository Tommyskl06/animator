//# sourceMappingURL=animator_test.mjs.map
import * as $autograders from "./autograders.mjs";
import * as $evaluator from "./evaluator_test.mjs";
import * as $extension from "./extension_test.mjs";
import { toList, List$Empty$const as $List$Empty$const, prepend as listPrepend } from "./gleam.mjs";
import * as $grader from "./grader.mjs";
import { check, question, untimed_check } from "./grader.mjs";
import * as $test_ids from "./test_ids_test.mjs";

export function main() {
  return $grader.main(
    toList([
      question(
        "q1",
        2,
        listPrepend(
          check("unbound_variable_test", $evaluator.unbound_variable_test),
          listPrepend(
            check("bound_variable_test", $evaluator.bound_variable_test),
            listPrepend(
              check(
                "lookup_finds_nearest_binding_test",
                $evaluator.lookup_finds_nearest_binding_test,
              ),
              listPrepend(
                check(
                  "lookup_unbound_name_test",
                  $evaluator.lookup_unbound_name_test,
                ),
                $List$Empty$const,
              ),
            ),
          ),
        ),
      ),
      question(
        "q2",
        2,
        listPrepend(
          check("call_test", $evaluator.call_test),
          listPrepend(
            check(
              "field_access_wrong_type_test",
              $evaluator.field_access_wrong_type_test,
            ),
            listPrepend(
              check(
                "unsupported_list_function_test",
                $evaluator.unsupported_list_function_test,
              ),
              listPrepend(
                check(
                  "builtin_step_limit_test",
                  $evaluator.builtin_step_limit_test,
                ),
                listPrepend(
                  check(
                    "call_evaluates_once_in_order_test",
                    $evaluator.call_evaluates_once_in_order_test,
                  ),
                  listPrepend(
                    check(
                      "call_reports_first_error_test",
                      $evaluator.call_reports_first_error_test,
                    ),
                    listPrepend(
                      check(
                        "pipe_evaluates_once_test",
                        $evaluator.pipe_evaluates_once_test,
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
      question(
        "q3",
        2,
        listPrepend(
          check("list_literal_test", $evaluator.list_literal_test),
          listPrepend(
            check("builtin_as_value_test", $evaluator.builtin_as_value_test),
            listPrepend(
              check("list_prepend_test", $evaluator.list_prepend_test),
              listPrepend(
                check(
                  "list_and_field_evaluate_once_test",
                  $evaluator.list_and_field_evaluate_once_test,
                ),
                listPrepend(
                  check("not_equal_test", $evaluator.not_equal_test),
                  listPrepend(
                    check("list_length_test", $evaluator.list_length_test),
                    $List$Empty$const,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      question(
        "q4",
        2,
        listPrepend(
          check(
            "shape_slider_is_bound_test",
            $evaluator.shape_slider_is_bound_test,
          ),
          listPrepend(
            check("field_access_test", $evaluator.field_access_test),
            listPrepend(
              check(
                "field_access_nested_test",
                $evaluator.field_access_nested_test,
              ),
              listPrepend(
                check(
                  "call_non_function_test",
                  $evaluator.call_non_function_test,
                ),
                listPrepend(
                  check("error_line_test", $evaluator.error_line_test),
                  listPrepend(
                    check(
                      "let_evaluates_once_test",
                      $evaluator.let_evaluates_once_test,
                    ),
                    listPrepend(
                      check(
                        "let_keeps_earlier_bindings_test",
                        $evaluator.let_keeps_earlier_bindings_test,
                      ),
                      listPrepend(
                        check(
                          "let_rebinding_test",
                          $evaluator.let_rebinding_test,
                        ),
                        listPrepend(
                          check("let_scope_test", $evaluator.let_scope_test),
                          $List$Empty$const,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      question(
        "q5",
        2,
        listPrepend(
          check("case_test", $evaluator.case_test),
          listPrepend(
            check("case_on_comparison_test", $evaluator.case_on_comparison_test),
            listPrepend(
              check(
                "case_evaluates_subject_once_test",
                $evaluator.case_evaluates_subject_once_test,
              ),
              listPrepend(
                check(
                  "case_evaluates_matching_arm_once_test",
                  $evaluator.case_evaluates_matching_arm_once_test,
                ),
                listPrepend(
                  check(
                    "variable_pattern_test",
                    $evaluator.variable_pattern_test,
                  ),
                  listPrepend(
                    check(
                      "case_pattern_shadowing_test",
                      $evaluator.case_pattern_shadowing_test,
                    ),
                    listPrepend(
                      check(
                        "case_int_pattern_test",
                        $evaluator.case_int_pattern_test,
                      ),
                      listPrepend(
                        check(
                          "short_circuit_test",
                          $evaluator.short_circuit_test,
                        ),
                        listPrepend(
                          check(
                            "boolean_operator_type_errors_test",
                            $evaluator.boolean_operator_type_errors_test,
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
        ),
      ),
      question(
        "q6",
        2,
        listPrepend(
          check("list_pattern_test", $evaluator.list_pattern_test),
          listPrepend(
            check("list_pattern_rest_test", $evaluator.list_pattern_rest_test),
            listPrepend(
              check(
                "case_keeps_outer_bindings_test",
                $evaluator.case_keeps_outer_bindings_test,
              ),
              listPrepend(
                check("case_scope_test", $evaluator.case_scope_test),
                $List$Empty$const,
              ),
            ),
          ),
        ),
      ),
      question(
        "q7",
        2,
        toList([
          check("helper_recursion_test", $evaluator.helper_recursion_test),
          check(
            "error_line_in_helper_test",
            $evaluator.error_line_in_helper_test,
          ),
          check(
            "named_function_as_value_test",
            $evaluator.named_function_as_value_test,
          ),
          check(
            "non_tail_recursion_limit_test",
            $evaluator.non_tail_recursion_limit_test,
          ),
          check(
            "runaway_append_step_limit_test",
            $evaluator.runaway_append_step_limit_test,
          ),
          check(
            "runaway_flatten_step_limit_test",
            $evaluator.runaway_flatten_step_limit_test,
          ),
          check(
            "branching_recursion_step_limit_test",
            $evaluator.branching_recursion_step_limit_test,
          ),
          check(
            "deep_equality_recursion_limit_test",
            $evaluator.deep_equality_recursion_limit_test,
          ),
          check(
            "user_function_evaluates_once_test",
            $evaluator.user_function_evaluates_once_test,
          ),
          check(
            "parameters_bind_in_order_test",
            $evaluator.parameters_bind_in_order_test,
          ),
          check(
            "each_call_has_its_own_frame_test",
            $evaluator.each_call_has_its_own_frame_test,
          ),
          check(
            "call_keeps_caller_bindings_test",
            $evaluator.call_keeps_caller_bindings_test,
          ),
          check(
            "function_cannot_see_caller_test",
            $evaluator.function_cannot_see_caller_test,
          ),
          check(
            "function_names_do_not_outlive_call_test",
            $evaluator.function_names_do_not_outlive_call_test,
          ),
          check(
            "parameter_hides_global_test",
            $evaluator.parameter_hides_global_test,
          ),
          check("mutual_recursion_test", $evaluator.mutual_recursion_test),
        ]),
      ),
      question(
        "q8",
        2,
        toList([
          check("lambda_map_test", $evaluator.lambda_map_test),
          check(
            "closure_captures_locals_test",
            $evaluator.closure_captures_locals_test,
          ),
          check(
            "closure_captures_slider_test",
            $evaluator.closure_captures_slider_test,
          ),
          check("function_in_let_test", $evaluator.function_in_let_test),
          check("function_capture_test", $evaluator.function_capture_test),
          check("curried_call_test", $evaluator.curried_call_test),
          check(
            "discarded_lambda_param_test",
            $evaluator.discarded_lambda_param_test,
          ),
          check("list_builtins_test", $evaluator.list_builtins_test),
          check(
            "list_builtin_type_errors_test",
            $evaluator.list_builtin_type_errors_test,
          ),
          check(
            "error_inside_list_function_test",
            $evaluator.error_inside_list_function_test,
          ),
          check(
            "error_line_in_lambda_test",
            $evaluator.error_line_in_lambda_test,
          ),
          check("error_message_line_test", $evaluator.error_message_line_test),
          check(
            "lambda_body_evaluates_per_call_test",
            $evaluator.lambda_body_evaluates_per_call_test,
          ),
          check(
            "list_builtins_apply_once_per_element_test",
            $evaluator.list_builtins_apply_once_per_element_test,
          ),
          check(
            "sugar_evaluates_per_call_test",
            $evaluator.sugar_evaluates_per_call_test,
          ),
          check(
            "closure_uses_defining_frame_test",
            $evaluator.closure_uses_defining_frame_test,
          ),
          check(
            "closure_cannot_see_caller_test",
            $evaluator.closure_cannot_see_caller_test,
          ),
          check(
            "closure_sees_only_earlier_bindings_test",
            $evaluator.closure_sees_only_earlier_bindings_test,
          ),
          check(
            "closures_are_independent_test",
            $evaluator.closures_are_independent_test,
          ),
          check(
            "closure_sees_every_enclosing_frame_test",
            $evaluator.closure_sees_every_enclosing_frame_test,
          ),
          check("lambda_shadowing_test", $evaluator.lambda_shadowing_test),
          check(
            "lambda_recursion_has_own_frames_test",
            $evaluator.lambda_recursion_has_own_frames_test,
          ),
          check(
            "lambda_names_do_not_outlive_call_test",
            $evaluator.lambda_names_do_not_outlive_call_test,
          ),
          check("use_scope_test", $evaluator.use_scope_test),
          check("capture_scope_test", $evaluator.capture_scope_test),
          check(
            "lambda_name_in_errors_test",
            $evaluator.lambda_name_in_errors_test,
          ),
          check(
            "list_as_a_local_name_test",
            $evaluator.list_as_a_local_name_test,
          ),
        ]),
      ),
      question(
        "q9",
        0,
        listPrepend(
          check("canvas_id_test", $test_ids.canvas_id_test),
          listPrepend(
            check("code_editor_id_test", $test_ids.code_editor_id_test),
            $List$Empty$const,
          ),
        ),
      ),
      question(
        "q10",
        0,
        listPrepend(
          check("shape_slider_id_test", $test_ids.shape_slider_id_test),
          listPrepend(
            check("speed_slider_id_test", $test_ids.speed_slider_id_test),
            $List$Empty$const,
          ),
        ),
      ),
      question(
        "q11",
        0,
        listPrepend(
          check("drawing_select_id_test", $test_ids.drawing_select_id_test),
          $List$Empty$const,
        ),
      ),
      question(
        "q12",
        0,
        listPrepend(
          check("extension_description_test", $extension.description_test),
          $List$Empty$const,
        ),
      ),
      question(
        "q13",
        1,
        listPrepend(
          untimed_check(
            "deployment_autograder_test",
            $autograders.deployment_autograder_test,
          ),
          $List$Empty$const,
        ),
      ),
      question(
        "q14",
        1,
        listPrepend(
          untimed_check(
            "video_autograder_test",
            $autograders.video_autograder_test,
          ),
          $List$Empty$const,
        ),
      ),
    ]),
  );
}
