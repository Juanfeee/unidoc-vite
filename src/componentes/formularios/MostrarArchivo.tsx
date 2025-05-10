import React from "react";

type Props = {
  file: {
    url: string;
    name: string;
  } | null;
};

export const MostrarArchivo: React.FC<Props> = ({ file }) => {
  if (!file) return null;

  return (
    <div className="text-sm text-gray-700 mt-2">
      <p>
        Archivo cargado:&nbsp;
        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {file.name}
        </a>
      </p>
    </div>
  );
};
