import { createScope } from "@zag-js/dom-query"
import type { FormMachineContext } from "./form.types"

type Ctx = FormMachineContext<string>

export const dom = createScope({
  getFormId: (ctx: Ctx) => ctx.ids?.form ?? `form:${ctx.id}`,
  getFieldId: (ctx: Ctx, name: any) => ctx.ids?.field?.(name) ?? `form:${ctx.id}:field:${name}`,

  getFormEl: (ctx: Ctx) => dom.getById(ctx, dom.getFormId(ctx)),
  getFieldEl: (ctx: Ctx, name: any) => dom.getById(ctx, dom.getFieldId(ctx, name)),
})
