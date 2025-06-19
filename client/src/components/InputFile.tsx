import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Button from "./Button";
import { BiTrash } from "react-icons/bi";

interface Props {
  name?: string;
  onFileChange: (file: File | null) => void; //Funcion
}

const InputFile = ({ onFileChange }: Props) => {
  //estado visualizar
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    // Revocar la URL cuando la previsualización cambie
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // Máximo 5MB
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        toast.error("Archivo no válido. Usa JPG/PNG, máx. 5MB.");
        return;
      }
      const file = acceptedFiles[0];

      //creamos el objeto
      setPreview(URL.createObjectURL(file));
      toast.success("Foto cargada correctamente");

      onFileChange(file);
    },
  });

  const handleRemoveImage = () => {
    // Revocar la URL antes de eliminar la previsualización
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onFileChange(null); // Notificar que no hay archivo
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-sm">Sube tu foto de perfil</h2>
      <div
        {...getRootProps()} //Props Contenedor
        className={`border-2 border-dashed p-3 rounded-lg w-full h-20 text-sm flex items-center justify-center text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} /> {/*Props input*/}
        {isDragActive ? (
          <p>Suelta la imagen aquí</p>
        ) : (
          <p>
            Arrastra una imagen o haz clic para seleccionar (JPG/PNG, máx. 5MB)
          </p>
        )}
      </div>
      {preview && (
        <div>
          <img
            src={preview}
            alt="Previsualización"
            className="w-32 h-32 object-cover rounded-full"
          />

          <Button
            text=""
            className="p-2 bg-red-600 rounded-full text-sm text-white my-2 h-10 w-10 mx-auto"
            icon={<BiTrash size={20} />}
            onClick={() => handleRemoveImage()}
          />
        </div>
      )}
    </div>
  );
};

export default InputFile;
