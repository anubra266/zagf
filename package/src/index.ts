import { formConnect } from "./form.connect"
import { createFormmachine } from "./form.machine"

import { createFieldMachine } from "./field.machine"
export * from "./form.types"

export const form = {
  connect: formConnect,
  machine: createFormmachine,
}

export const field = {
  machine: createFieldMachine,
}
