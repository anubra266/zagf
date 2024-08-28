import type { FieldMachineContext, FormMachineContext } from "./form.types"

export { default as equal } from "fast-deep-equal"

export function isPromise(value: any): value is Promise<any> {
  return !!value && typeof value.then === "function"
}

export function getFieldValues<K extends string>(fields: FormMachineContext<K>["fields"]) {
  const values = {} as Record<K, any>
  for (const key in fields) {
    if (Object.hasOwnProperty.call(fields, key)) {
      values[key] = fields[key].state.context.value
    }
  }
  return values
}

export function getErrors<K extends string>(fields: FormMachineContext<K>["fields"]) {
  const errors = {} as Record<K, string>
  for (const key in fields) {
    if (Object.hasOwnProperty.call(fields, key)) {
      const error = fields[key].state.context.error
      if (error) errors[key] = error
    }
  }
  return errors
}

export function isValidating<K extends string>(fields: FormMachineContext<K>["fields"]) {
  return checkFieldContext(fields, "validating")
}

export function isDirty<K extends string>(fields: FormMachineContext<K>["fields"]) {
  return checkFieldContext(fields, "dirty")
}

export function hasError<K extends string>(fields: FormMachineContext<K>["fields"]) {
  return checkFieldContext(fields, "error")
}

function checkFieldContext<K extends string>(fields: FormMachineContext<K>["fields"], item: keyof FieldMachineContext) {
  for (const key in fields) {
    if (Object.hasOwnProperty.call(fields, key)) {
      if (fields[key].state.context[item]) return true
    }
  }
  return false
}
