import { createMachine, type StateMachine as S, guards } from "@zag-js/core"
import { compact, isFunction } from "@zag-js/utils"
import type {
  FieldMachineContext,
  FormMachineContext,
  FormMachineEvent,
  FormMachineState,
  FormUserDefinedContext,
} from "./form.types"
import { createFieldMachine } from "./field.machine"
import * as utils from "./form.utils"
import { nextTick } from "@zag-js/dom-query"
const { or } = guards

export function createFormmachine<K extends string>(userContext: FormUserDefinedContext<K>) {
  const ctx = compact(userContext)

  const FIELD_EVENTS: S.TransitionDefinitionMap<FormMachineContext<K>, FormMachineState, FormMachineEvent<K>> = {
    "FIELD.CHANGE": [
      {
        guard: or("validateAll", "validateChange"),
        actions: ["changeField", "validate"],
      },
      {
        actions: ["changeField"],
      },
    ],
    "FIELD.BLUR": [
      {
        guard: or("validateAll", "validateBlur"),
        actions: ["blurField", "validate"],
      },
      {
        actions: ["blurField"],
      },
    ],
    "FIELD.FOCUS": {
      actions: ["focusField"],
    },
  }

  return createMachine<FormMachineContext<K>, FormMachineState, FormMachineEvent<K>>(
    {
      id: "form",
      initial: isFunction(ctx.defaultValues) ? "loading" : "initialized",

      created: ["initializeFields"],

      context: {
        defaultValues: () => ({}) as Record<K, any>,
        fields: {} as Record<K, any>,
        validation: "all",
        ...ctx,
      },

      //   watch: {
      //     defaultValues: "syncFields",
      //   },

      computed: {},

      states: {
        loading: {
          entry: ["loadValues"],
          on: {
            INITIALIZE: { actions: ["initializeFields", "onInitialized"] },
            INITIALIZED: "initialized",
          },
        },
        initialized: {
          on: {
            ...FIELD_EVENTS,
            SUBMIT: [
              { guard: or("validateAll", "validateSubmit"), target: "submitting", actions: ["validate"] },
              { target: "submitted" },
            ],
          },
        },
        submitting: {
          on: {
            SUBMITTED: {
              target: "submitted",
              actions: ["resetErrors"],
            },
            "SUBMIT.ABORT": "initialized",
          },
        },
        submitted: {
          on: {
            ...FIELD_EVENTS,
            SUBMIT: "submitting",
          },
        },
      },
    },
    {
      guards: {
        validateAll: (ctx) => ctx.validation === "all",
        validateSubmit: (ctx) => ctx.validation === "submit",
        validateBlur: (ctx) => ctx.validation === "blur",
        validateChange: (ctx) => ctx.validation === "change",
      },

      actions: {
        resetErrors(ctx) {
          for (const key in ctx.fields) {
            ctx.fields[key].send({ type: "RESET_ERROR" })
          }
        },
        validate(ctx, evt, { send }) {
          if (evt.type === "SUBMIT") {
            for (const key in ctx.fields) {
              ctx.fields[key].send({ type: "VALIDATE", validator: ctx.validate?.[key] })
            }

            if (utils.hasError(ctx.fields)) nextTick(() => send("SUBMIT.ABORT"))
            else {
              const values = utils.getFieldValues(ctx.fields)
              evt.cb?.(values)
              send("SUBMITTED")
            }
          } else if (evt.type === "FIELD.FOCUS" || evt.type === "FIELD.BLUR") {
            const field = (ctx.fields as any)[evt.name]
            field.send({ type: "VALIDATE", validator: (ctx.validate as any)?.[evt.name] })
          }
        },

        changeField(ctx, evt) {
          if (evt.type !== "FIELD.CHANGE") return
          const field = ctx.fields[evt.name]
          if (field) field.send({ type: "CHANGE", value: evt.value })
        },
        focusField(ctx, evt) {
          if (evt.type !== "FIELD.FOCUS") return
          const field = (ctx.fields as any)[evt.name]
          if (field) field.send({ type: "FOCUS" })
        },
        blurField(ctx, evt) {
          if (evt.type !== "FIELD.BLUR") return
          const field = (ctx.fields as any)[evt.name]
          if (field) field.send({ type: "BLUR" })
        },

        initializeFields(ctx, _, { self }) {
          if (isFunction(ctx.defaultValues)) return

          for (const fieldName in ctx.defaultValues) {
            const options: FieldMachineContext = {
              dir: ctx.dir,
              getRootNode: ctx.getRootNode,
              id: fieldName,
              value: ctx.defaultValues[fieldName],
              defaultValue: ctx.defaultValues[fieldName],
            }
            const field = createFieldMachine(options)
            const actor = self.spawn(field)
            ctx.fields[fieldName] = actor
          }
        },
        loadValues(ctx, _, { send }) {
          if (!isFunction(ctx.defaultValues)) return
          const values = ctx.defaultValues()
          if (utils.isPromise(values)) {
            values.then((_values) => {
              ctx.defaultValues = _values
              return send("INITIALIZE")
            })
          } else {
            ctx.defaultValues = values
            send("INITIALIZE")
          }
        },
        onInitialized(_, __, { send }) {
          nextTick(() => send("INITIALIZED"))
        },
      },
    },
  )
}
