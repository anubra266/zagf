# zagf

## 0.0.3

### Patch Changes

- [`6eec4d5`](https://github.com/anubra266/zagf/commit/6eec4d53e2c718520cabc591c2ca19ae5a5d6776) Thanks
  [@anubra266](https://github.com/anubra266)! - Add `focusOnError` option. For configuring whether to focus on the first
  field with error after submitting

- [`074009e`](https://github.com/anubra266/zagf/commit/074009ea74907738760035dd66d4e3017e75f97b) Thanks
  [@anubra266](https://github.com/anubra266)! - - Fix change validation
  - Expose values to validate callbacks

## 0.0.2

### Patch Changes

- [`e318e19`](https://github.com/anubra266/zagf/commit/e318e19c37db5781c315c7324d9366fc7dae1fae) Thanks
  [@anubra266](https://github.com/anubra266)! - First working release!

- [`64bc9a5`](https://github.com/anubra266/zagf/commit/64bc9a5ff44246f2cb741080665cde862a80ee59) Thanks
  [@anubra266](https://github.com/anubra266)! - - Support field level validation

  ```jsx
  <input
    {...api.getFieldProps("name", {
      validate: (value) => (value.length < 5 ? "Name must have at least 5 letters" : null),
    })}
  />
  ```

  - Add `validation` option to the form machine config. It can be set to `submit`, `blur` or `change` to validate only
    on those events.

## 0.0.1

### Patch Changes

- [`75ea134`](https://github.com/anubra266/zagf/commit/75ea134172275305d6d8bd6335b08423e39e46ba) Thanks
  [@anubra266](https://github.com/anubra266)! - Hoard package on npm
