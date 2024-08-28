// https://mantine.dev/form/use-form/
export const pkg = "zagf"

// export { anatomy } from "./form.anatomy"
import { formConnect } from "./form.connect"
import { fieldConnect } from "./field.connect"
import { createFormmachine } from "./form.machine"

import { createFieldMachine } from "./field.machine"
export * from "./form.types"

export const form = {
  connect: formConnect,
  machine: createFormmachine,
}

export const field = {
  connect: fieldConnect,
  machine: createFieldMachine,
}
