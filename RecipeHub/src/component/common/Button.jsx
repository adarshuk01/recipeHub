import Loader from "./Loader";

// ✅ Reusable Button component
export const Button = ({ children, variant = "primary", loading = false, ...props }) => {
  const base = "px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60 disabled:bg-gray-400 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed",
  };

  return (
    <button
      className={`${base} ${styles[variant]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader size={20} /> : children}
    </button>
  );
};
