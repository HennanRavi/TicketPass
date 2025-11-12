import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = "default", text = "Carregando..." }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin mx-auto mb-4`} />
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  );
}