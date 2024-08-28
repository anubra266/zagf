# Zagf

Agnostic form library through finite state machines

## Installation

```bash
$ npm install zagf
```

### Prerequisites

Zagf requires [Zag-js](https://zagjs.com/) to run.

## Usage

```jsx
import { form } from "zagf"

const App = () => {
  const [state, send] = useMachine(form.machine({ id: "form", defaultValues: { name: "zag", email: "" } }))
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

## License

MIT
