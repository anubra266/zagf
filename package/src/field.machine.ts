import { createMachine } from "@zag-js/core"
import { compact } from "@zag-js/utils"
import type { FieldMachineContext, FieldMachineEvent, FieldMachineState, FieldUserDefinedContext } from "./form.types"
import { equal } from "./form.utils"

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

          // TODO try to do validation set from field context
          // We want to check if there's a validator in event first, prefer it over the one in field context
          if (evt.validator) ctx.error = evt.validator(ctx.value)

          ctx.validating = false
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
        value: (prev, current) => equal(prev, current),
      },
    },
  )
}
