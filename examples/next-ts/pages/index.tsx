import { pkg, form } from "zagf"
import { normalizeProps, useMachine } from "@zag-js/react"
import { useId } from "react"
import { StateVisualizer } from "../components/state-visualizer"

// form.queryselector... by name: to get inputs
// validations schemas (zod / valibot)
// dependent fields (start/end dates) validation
// auto-focus on error

function validateAsync(value: string): Promise<string | null> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(value === "mantine" ? null : 'Value must be "mantine"')
    }, 800)
  })
}

const Page = () => {
  const [state, send] = useMachine(
    form.machine({
      id: useId(),
      defaultValues: { name: "zag", email: "" },
      validate: {
        name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
        // name:validateAsync,
        email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      },
    }),
  )
  // const [state, send] = useMachine(form.machine({ id: useId(), defaultValues: () => ({ name: "zag", email: "" }) }))
  // const [state, send] = useMachine(
  //   form.machine({
  //     id: useId(),
  //     defaultValues: () => {
  //       return new Promise((r) => setTimeout(() => r({ name: "zag", email: "" }), 1000))
  //     },
  //   }),
  // )
  const api = form.connect(state, send, normalizeProps)

  return (
    <div>
      <h2>{pkg} + React</h2>
      {/*  */}

      <form onSubmit={api.onSubmit((values) => console.log(values))}>
        <div>
          <label htmlFor="name">Name</label>
          <input {...api.getFieldProps("name")} />
          <span>{api.errors.name}</span>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input {...api.getFieldProps("email", { type: "email" })} />
          <span>{api.errors.email}</span>
        </div>

        <button type="submit">Submit</button>
      </form>

      {/*  */}

      <br />
      <div style={{ display: "flex", gap: "1rem" }}>
        <StateVisualizer state={state} omit={["fields"]} />
        {Object.entries(state.context.fields).map(([fieldName, field]) => (
          <div key={fieldName}>
            {fieldName}
            <StateVisualizer key={fieldName} state={field.state} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
