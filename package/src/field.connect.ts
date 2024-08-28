// import { dataAttr } from "@zag-js/dom-query"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
// import { parts } from "./form.anatomy"
// import { dom } from "./form.dom"
import type { FieldMachineApi, FieldSend, FieldState } from "./form.types"

export function fieldConnect<T extends PropTypes>(
  state: FieldState,
  send: FieldSend,
  normalize: NormalizeProps<T>,
): FieldMachineApi<T> {
  return {
    getFieldProps: (name) => {
      return normalize.element({})
    },
  }
}
