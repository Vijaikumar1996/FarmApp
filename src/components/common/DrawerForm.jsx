export default function DrawerForm({
  title,

  subtitle,

  onClose,

  children,
}) {
  return (
    <div>
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>

          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        <button onClick={onClose} className="text-2xl">
          ×
        </button>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}
