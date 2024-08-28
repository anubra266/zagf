import { createMachine } from "@zag-js/core"
import { compact } from "@zag-js/utils"
import type { FieldMachineContext, FieldMachineEvent, FieldMachineState, FieldUserDefinedContext } from "./form.types"
import * as utils from "./form.utils"

export function createFieldMachine(userContext: FieldUserDefinedContext) {
  const ctx = compact(userContext)
  return createMachine<FieldMachineContext, FieldMachineState, FieldMachineEvent>(
    {
      id: "field",
      initial: "idle",

      context: {
        focused: false,
        touched: false,
        dirty: false,
        validating: false,
        error: null,
        ...ctx,
      },

      created: ["setDefaultValue"],

      on: {
        FOCUS: {
          actions: ["focus"],
        },
        BLUR: {
          actions: ["blur"],
        },
      },

      watch: {
        value: "valueChanged",
      },

      states: {
        idle: {
          on: {
            CHANGE: { actions: ["updateValue"] },
            VALIDATE: { actions: ["validate"] },
            RESET_ERROR: { actions: ["resetError"] },
          },
        },
      },
    },
    {
      guards: {},

      actions: {
        resetError(ctx) {
          ctx.error = null
        },
        validate(ctx, evt) {
          if (evt.type !== "VALIDATE") return
          ctx.validating = true

          const validate = evt.validator ?? ctx.validate
          if (!validate) return

          const validated = validate(ctx.value, evt.values ?? {})
          if (utils.isPromise(validated)) {
            validated.then((error) => {
              // TODO remove
              // console.log("validate promise", error)

              ctx.error = error
              ctx.validating = false
            })
          } else {
            ctx.error = validated
            ctx.validating = false
          }
        },
        valueChanged(ctx) {
          ctx.dirty = ctx.value !== ctx.defaultValue
          ctx.touched = true
        },
        updateValue(ctx, evt) {
          if (evt.type === "CHANGE") ctx.value = evt.value
        },
        focus(ctx) {
          ctx.focused = true
          ctx.touched = true
        },
        blur(ctx) {
          ctx.focused = false
        },
      },

      compareFns: {
        value: (prev, current) => utils.equal(prev, current),
      },
    },
  )
}
