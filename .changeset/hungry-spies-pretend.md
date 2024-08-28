---
"zagf": patch
---

- Support field level validation

```jsx
<input
  {...api.getFieldProps("name", {
    validate: (value) => (value.length < 5 ? "Name must have at least 5 letters" : null),
  })}
/>
```

- Add `validation` option to the form machine config. It can be set to `submit`, `blur` or `change` to validate only on
  those events.
