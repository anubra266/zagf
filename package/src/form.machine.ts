import { createMachine, type StateMachine as S } from "@zag-js/core"
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

export function createFormmachine<K extends string>(userContext: FormUserDefinedContext<K>) {
  const ctx = compact(userContext)

  const FIELD_EVENTS: S.TransitionDefinitionMap<FormMachineContext<K>, FormMachineState, any> = {
    "FIELD.CHANGE": [
      //   {
      // validate if validate on change is active
      //   },
      {
        actions: ["changeField"],
      },
    ],
    "FIELD.BLUR": [
      //   {
      // validate if validate on blur is active
      //   },
      {
        actions: ["blurField"],
      },
    ],
    "FIELD.FOCUS": {
      actions: ["focusField"],
    },
    "FIELD.VALIDATE": {
      // actions: ["validate"],
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
        // validating: false,

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
            SUBMIT: "submitting",
          },
        },
        submitting: {
          entry: ["validate"],
          on: {
            SUBMITTED: {
              target: "submitted",
              actions: ["resetErrors"],
            },
            ABORT: "initialized",
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
      guards: {},

      actions: {
        resetErrors(ctx) {
          for (const key in ctx.fields) {
            ctx.fields[key].send({ type: "RESET_ERROR" })
          }
        },
        validate(ctx, evt, { send }) {
          // TODO Handle both submit, change, blur, guards will decide if they reach here
          if (evt.type === "SUBMIT") {
            for (const key in ctx.fields) {
              ctx.fields[key].send({ type: "VALIDATE", validator: ctx.validate?.[key] })
            }
            if (utils.hasError(ctx.fields)) send("ABORT")
            else {
              const values = utils.getFieldValues(ctx.fields)
              evt.cb?.(values)
              send("SUBMITTED")
            }
          }
        },

        changeField(ctx, evt) {
          const field = (ctx.fields as any)[evt.name]
          if (field) field.send({ type: "CHANGE", value: evt.value })
        },
        focusField(ctx, evt) {
          const field = (ctx.fields as any)[evt.name]
          if (field) field.send({ type: "FOCUS" })
        },
        blurField(ctx, evt) {
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
