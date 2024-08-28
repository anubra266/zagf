// import { dataAttr } from "@zag-js/dom-query"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
// import { parts } from "./form.anatomy"
// import { dom } from "./form.dom"
import type { FormMachineApi, FormSend, FormState } from "./form.types"
import * as utils from "./form.utils"
import { dom } from "./form.dom"

export function formConnect<K extends string, T extends PropTypes>(
  state: FormState<K>,
  send: FormSend<K>,
  normalize: NormalizeProps<T>,
): FormMachineApi<K, T> {
  const loading = state.matches("loading")

  return {
    dirty: utils.isDirty(state.context.fields),
    validating: utils.isValidating(state.context.fields),
    errors: utils.getErrors(state.context.fields),

    getValues: () => utils.getFieldValues(state.context.fields),

    onSubmit(cb) {
      return (event) => {
        event?.preventDefault()
        send({ type: "SUBMIT", cb })
      }
    },

    getFieldProps: (name, options) => {
      const field = state.context.fields[name]
      if (!loading && !field) throw new Error(`Add ${name} in values`)
      field.setContext({ validate: options?.validate })

      return normalize.element({
        id: dom.getFieldId(state.context, name),
        name,
        type: options?.type,
        value: field?.state.context.value ?? "",
        disabled: loading,

        onChange: (event) => {
          send({ type: "FIELD.CHANGE", name, value: (event.currentTarget as HTMLInputElement).value })
        },
        onFocus: () => {
          send({ type: "FIELD.FOCUS", name })
        },
        onBlur: () => {
          send({ type: "FIELD.BLUR", name })
        },
      })
    },
  }
}
