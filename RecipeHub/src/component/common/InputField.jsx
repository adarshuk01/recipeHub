// ✅ Reusable InputField component
export const  InputField = ({ label, value, onChange, placeholder, type = "text", disabled = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-md font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none ${
          disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white"
        }`}
      />
    </div>
  );
};