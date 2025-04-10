
export default function Dropdown({
  dropdownRef,
  selectedOptions,
  handleCheckboxChange,
}: any) {
  const certificates = [
    { name: "Bonafide Certicate" },
    { name: "TC Applications" },
    { name: "Library Access" },
  ];
  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 mt-40 w-48 bg-white border border-gray-300 shadow-md rounded-md p-2 z-10 dark:bg-black"
    >
      {certificates.map((certificate) => (
        <label
          key={certificate.name}
          className="flex items-center gap-2 dark:text-white"
        >
          <input
            type="checkbox"
            checked={selectedOptions.includes(certificate.name)}
            onChange={() => handleCheckboxChange(certificate.name)}
          />
          {certificate.name}
        </label>
      ))}
    </div>
  );
}
