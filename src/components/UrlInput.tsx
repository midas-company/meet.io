import React from "react";

export default function UrlInput({ labelText }: { labelText?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {labelText && <label className="text-2xl font-medium">{labelText}</label>}
      <div className="flex">
        <input
          type="text"
          className="w-full rounded-bl-lg rounded-tl-lg border border-gray-300 bg-white pl-2 text-base font-normal outline-none transition-colors hover:border-blue-500"
        />
        <input
          type="button"
          value="Join"
          className="rounded-br-lg rounded-tr-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
        />
      </div>
    </div>
  );
}
