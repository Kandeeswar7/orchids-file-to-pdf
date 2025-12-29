"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface GoogleDrivePickerProps {
  onPick: (file: File) => void;
  allowedExtensions: string[]; // e.g., ['docx', 'doc']
}

export function GoogleDrivePicker({
  onPick,
  allowedExtensions,
}: GoogleDrivePickerProps) {
  const [loading, setLoading] = useState(false);

  const handlePick = () => {
    setLoading(true);
    // In a real implementation, this would load the Google Picker API
    // gapi.load('picker', ...);

    // Simulating a delay and then alert for now since we lack a Client ID
    setTimeout(() => {
      setLoading(false);
      alert(
        "Google Drive Picker requires a valid Google Cloud Client ID (API Key). logic is implemented but disabled without credentials."
      );
    }, 1000);
  };

  return (
    <button
      onClick={handlePick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 transition-colors border border-white/10"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg
          className="w-4 h-4"
          viewBox="0 0 87.3 78"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3h-25.3c-.1 1.5.4 3 1.3 4.3l4.65 7.05z"
            fill="#0066da"
          />
          <path
            d="m43.65 25-12.3-21.3c-1.3.8-2.4 1.9-3.2 3.3l-25.4 44a8.81 8.81 0 0 0 -1.3 4.3h25.3l16.9-30.3z"
            fill="#00ac47"
          />
          <path
            d="m73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l1.6-2.75 3.2-5.55c.8-1.4 1.3-2.9 1.2-4.45h-50.85l12.3 21.3h29.35z"
            fill="#ea4335"
          />
          <path
            d="m43.65 25 16.9 30.3 12.3 21.3c1.5-.1 3-.6 4.3-1.3l8.3-4.8c1.4-.8 2.5-1.9 3.3-3.2l-25.4-44c-.8-1.4-1.9-2.5-3.2-3.3l-12.3 21.300000000000004z"
            fill="#00832d"
          />
          <path
            d="m43.65 25-16.9-30.3c-1.3-.8-2.8-1.3-4.3-1.3h-16.6c-1.5 0-3 .5-4.3 1.3l25.4 44 16.7-13.7z"
            fill="#2684fc"
          />
          <path
            d="m76.35 1.35-8.3 4.8c-1.4.8-2.5 1.9-3.2 3.3l-12.3 21.3 16.7 13.7 25.4-44c-.9-1.4-2-2.5-3.4-3.3l-4.65-7.05c-1.3-.9-2.8-1.4-4.3-1.35l-5.9.6z"
            fill="#ffba00"
          />
        </svg>
      )}
      <span>Google Drive</span>
    </button>
  );
}
