import React from "react";

const Button = ({ text, onClick, type = "primary", className = "" }) => {
  // Dynamically assign Tailwind class names based on button type
  const getClassNames = () => {
    const base = "px-6 py-3 rounded-lg text-white font-semibold focus:outline-none transition duration-200";
    switch (type) {
      case "primary":
        return `${base} bg-blue-500 hover:bg-blue-600`;
      case "secondary":
        return `${base} bg-gray-500 hover:bg-gray-600`;
      case "danger":
        return `${base} bg-red-500 hover:bg-red-600`;
      default:
        return `${base} bg-blue-500 hover:bg-blue-600`;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getClassNames()} ${className}`} // Merge dynamic and custom classes
      aria-label={text} // Adding accessibility label
    >
      {text}
    </button>
  );
};

export default Button;
