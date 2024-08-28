# Zagf

Agnostic form library through finite state machines

## Uhm...

It's quite new, doesn't do much yet. But feel free to remind me of missing features. I'm in the mood. 😉

And sure...you can contribute!

## Installation

```bash
$ npm install zagf
```

### Prerequisites

Zagf requires [Zag-js](https://zagjs.com/) to run.

## Usage

### Basic

```jsx
import { form } from "zagf"

const App = () => {
  const [state, send] = useMachine(
    form.machine({
      id: "form",
      defaultValues: { name: "zag", email: "" },
    }),
  )
  const api = form.connect(state, send)

  return (
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
  )
}
```

### Validate

Pass a `validate` object to the machine config to validate the form fields.

```jsx
import { form } from "zagf"

const App = () => {
  const [state, send] = useMachine(
    form.machine({
      id: "form",
      defaultValues: { name: "zag", email: "" },
      validate: {
        name: (value) => (value.length < 2 ? "Name must have at least 2 letters" : null),
        email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      },
    }),
  )
  const api = form.connect(state, send)

  return (
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
  )
}
```

> The `validation` option is set to `all` by default. You can change it to `submit`, `blur` or `change` to validate only
> on those events.

#### Field Level Validation

You can also pass a `validate` function to the `getFieldProps` to validate the field.

```jsx
import { form } from "zagf"

const App = () => {
  const [state, send] = useMachine(
    form.machine({
      id: "form",
      defaultValues: { name: "zag", email: "" },
    }),
  )
  const api = form.connect(state, send)

  return (
    <form onSubmit={api.onSubmit((values) => console.log(values))}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          {...api.getFieldProps("name", {
            validate: (value) => (value.length < 5 ? "Name must have at least 5 letters" : null),
          })}
        />
        <span>{api.errors.name}</span>
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          {...api.getFieldProps("email", {
            type: "email",
            validate: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
          })}
        />
        <span>{api.errors.email}</span>
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
```

## License

MIT
