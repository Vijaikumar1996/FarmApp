export default function QuantityInput({
  register,
  name,
  label = "Quantity",
  disabled = false,
  error,
  step = 0.5,
  min = 0.5,
  className = "",
}) {
  const registration = register(name, {
    valueAsNumber: true,
  });

  console.log(name, registration);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      <input
        type="number"
        step={step}
        min={min}
        disabled={disabled}
        className={`
                    w-full
                    border
                    border-gray-300
                    rounded-xl
                    px-4
                    py-2.5
                    disabled:bg-gray-100
                    disabled:cursor-not-allowed
                    ${className}
                `}
        {...register(name, {
          valueAsNumber: true,
        })}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
