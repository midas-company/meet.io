type SelectType = {
  options: { value: string; label: string }[];
};

export default function SelectInput({ options }: SelectType) {
  return (
    <select className="h-10 w-96 rounded text-center">
      {
        <option value="" selected disabled>
          Selecione
        </option>
      }
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
