import { type ChangeEvent } from "react";

interface Props {
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  // Adicionamos a definição da função que captura a digitação
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputCustom = ({
  label,
  type,
  value,
  placeholder,
  onChange,
  required = false,
}: Props) => {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value} // Agora o input mostra o que está no estado
        onChange={onChange}
        required={required} // Agora o input avisa quando o usuário digita
      />
    </div>
  );
};
