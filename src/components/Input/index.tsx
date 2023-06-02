import { InputStyle, InputWrapper, Label } from "./styles";

interface IInputProps {
  type: string;
  label: string;
  placeholder: string;
  value: string;
  setValue(e: any): void;
}

export function Input({ type, label, placeholder, value, setValue }: IInputProps) {
  return (
    <InputWrapper>
      <Label>{label}</Label>
      <InputStyle
        value={value}
        type={type}
        onChange={setValue}
        placeholder={placeholder}
        minLength={1}
        maxLength={30}
      />
    </InputWrapper>
  )
}