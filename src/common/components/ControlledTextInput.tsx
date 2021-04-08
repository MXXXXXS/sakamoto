import { TextInput } from 'grommet'
import React, { useEffect, useMemo, useRef, useState } from 'react'

type TextInputType = typeof TextInput
type Props = Omit<Parameters<TextInputType>[0], 'value'>

export function ControlledTextInput({
  controlledValue,
  props,
  onInput,
}: {
  controlledValue: string
  props: Props
  onInput: (value: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState(controlledValue)
  const [usingInitialValue, setUsingInitialValue] = useState(true)
  const value = useMemo(
    () => (usingInitialValue ? controlledValue : inputValue),
    [usingInitialValue, controlledValue, inputValue]
  )
  useEffect(() => {
    setInputValue(controlledValue)
  }, [controlledValue, setInputValue])
  return (
    <TextInput
      ref={ref}
      {...props}
      value={value}
      onChange={(event) => {
        const value = event.currentTarget.value
        setInputValue(value)
      }}
      onFocus={() => {
        setUsingInitialValue(false)
      }}
      onBlur={(event) => {
        setUsingInitialValue(true)
        const value = event.currentTarget.value
        onInput(value)
        setInputValue(controlledValue)
      }}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          ref.current?.blur()
        }
      }}
    ></TextInput>
  )
}
