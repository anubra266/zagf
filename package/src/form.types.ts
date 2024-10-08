import type { Machine, StateMachine as S } from "@zag-js/core"
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from "@zag-js/types"
import type { JSX } from "@zag-js/types"

interface FieldOptions<K extends string> {
  type?: string
  validate?: ValidatorFn<K>
}

type ValiidatorResult = string | null | Promise<string | null>
type ValidatorFn<K extends string = string> = (value: any, values: Record<K, any>) => ValiidatorResult
type ValidateRules<K extends string> = Partial<Record<K, ValidatorFn<K>>>

/* -----------------------------------------------------------------------------
 * Field Machine context
 * -----------------------------------------------------------------------------*/

interface FieldPublicContext extends DirectionProperty, CommonProperties {
  /**
   * The value of the field
   */
  value?: any
  /**
   * Validation rule for the field
   */
  validate?: ValidatorFn
}

export type FieldUserDefinedContext = RequiredBy<FieldPublicContext, "id">

type FieldComputedContext = Readonly<{}>

interface FieldPrivateContext {
  /**
   * @internal
   * Whether the field is focused
   */
  focused?: boolean
  /**
   * @internal
   * Whether the field is touched
   * Field is considered to be touched when user focused it or its value was changed programmatically
   */
  touched?: boolean
  /**
   * @internal
   * Whether the field is dirty
   * Field is considered to be dirty when its value was changed and new value is different from field value specified in initialValues (compared with fast-deep-equal)
   */
  dirty?: boolean
  /**
   * @internal
   * The default value of the field
   */
  defaultValue?: any
  /**
   * @internal
   * Whether the form is validating
   */
  validating?: boolean
  /**
   * @internal
   * Erros in the field
   */
  error?: string | null
}

export interface FieldMachineContext extends FieldPublicContext, FieldPrivateContext, FieldComputedContext {}

export interface FieldMachineState {
  value: "idle" | "validating" | "valid" | "invalid"
}

type FieldChangeEvent = { type: "CHANGE"; value: any }
type FieldFocusEvent = { type: "FOCUS" }
type FieldBlurEvent = { type: "BLUR" }
type FieldValidateEvent = { type: "VALIDATE"; validator?: ValidatorFn; values?: Record<string, any> }
type FieldResetErrorEvent = { type: "RESET_ERROR" }

export type FieldMachineEvent =
  | FieldFocusEvent
  | FieldBlurEvent
  | FieldChangeEvent
  | FieldValidateEvent
  | FieldResetErrorEvent

export type FieldState = S.State<FieldMachineContext, FieldMachineState, FieldMachineEvent>

export type FieldSend = S.Send<FieldMachineEvent>

export type FieldService = Machine<FieldMachineContext, FieldMachineState, FieldMachineEvent>

/* -----------------------------------------------------------------------------
 * Form Machine context
 * -----------------------------------------------------------------------------*/

export type ElementIds<K> = Partial<{
  form: string
  field(name: K): string
}>

interface FormPublicContext<K extends string> extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the form. Useful for composition.
   */
  ids?: ElementIds<K>
  /**
   * The default values of the fields in the form
   */
  defaultValues: Record<K, any> | (() => Record<K, any> | Promise<Record<K, any>>)
  /**
   * Validation rules for the form
   */
  validate?: ValidateRules<K>
  /**
   * When validation gets triggered
   * @default "all"
   */
  validation: "change" | "submit" | "blur" | "all"
  /**
   * Whether to focus on the first field with error after submitting
   * @default true
   */
  focusOnError?: boolean
}

export type FormUserDefinedContext<K extends string> = RequiredBy<FormPublicContext<K>, "id">

type FormComputedContext = Readonly<{}>

interface FormPrivateContext<K extends string> {
  /**
   * @internal
   * The child field machines (spawned by the form)
   */
  fields: Record<K, FieldService>
}

export interface FormMachineContext<K extends string>
  extends FormPublicContext<K>,
    FormPrivateContext<K>,
    FormComputedContext {}

export interface FormMachineState {
  value: "loading" | "initialized" | "submitting" | "submitted"
}

type FormInitializeEvent = { type: "INITIALIZE" }
type FormInitializedEvent = { type: "INITIALIZED" }
type FormFieldChangeEvent<K extends string> = { type: "FIELD.CHANGE"; name: K; value: any }
type FormFieldFocusEvent<K extends string> = { type: "FIELD.FOCUS"; name: K }
type FormFieldBlurEvent<K extends string> = { type: "FIELD.BLUR"; name: K }
type FormSubmitEvent<K extends string> = { type: "SUBMIT"; cb: (values: Record<K, any>) => void }
type FormSubmittedEvent = { type: "SUBMITTED" }
type FormSubmitAbortEvent = { type: "SUBMIT.ABORT" }

export type FormMachineEvent<K extends string> =
  | FormInitializeEvent
  | FormInitializedEvent
  | FormFieldChangeEvent<K>
  | FormFieldFocusEvent<K>
  | FormFieldBlurEvent<K>
  | FormSubmitEvent<K>
  | FormSubmittedEvent
  | FormSubmitAbortEvent

export type FormState<K extends string> = S.State<FormMachineContext<K>, FormMachineState, FormMachineEvent<K>>

export type FormSend<K extends string> = S.Send<FormMachineEvent<K>>

export type FormService<K extends string> = Machine<FormMachineContext<K>, FormMachineState, FormMachineEvent<K>>

/* -----------------------------------------------------------------------------
 * Component API
 * -----------------------------------------------------------------------------*/

export interface FormMachineApi<K extends string, T extends PropTypes = PropTypes> {
  /**
   * Whether the form is dirty
   */
  dirty: boolean
  /**
   * Whether the form is validating
   */
  validating: boolean
  /**
   * Errors in the form
   */
  errors: Record<K, string>
  /**
   * Function to get Current values of the form
   */
  getValues: () => Record<K, any>

  /**
   * Function to submit the form.
   */
  onSubmit<E extends JSX.FormEvent<HTMLFormElement>>(cb: (values: Record<K, any>) => void): (event?: E) => void
  getFieldProps(name: K, options?: FieldOptions<K>): T["element"]
}
