import React from "react";

function OutlineButton({ 
  label, 
  icon: Icon, 
  active = false, 
  onClick, 
  className = "" 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors
        ${active 
          ? "border-orange-500 text-orange-600 bg-orange-50" 
          : "border-gray-300 text-gray-700 hover:bg-gray-100"} 
        ${className}`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}

export default OutlineButton;
