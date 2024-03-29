type SelectType = {
  options: { value: string; label: string }[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectInput({ options, ...rest }: SelectType) {
  return (
    <select className="h-10 w-96 rounded text-center" {...rest}>
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      ) : (
        <option value="Sem dipositivos">Sem dispositivos</option>
      )}
    </select>
  );
}
