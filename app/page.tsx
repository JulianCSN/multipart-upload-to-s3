"use client"

import { useState } from 'react';
import Image from "next/image";
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import UploadModal from '@/components/UploadModal';

// S3Client: Configura el cliente de AWS S3 con las credenciales y la región necesarias para conectarse al bucket S3.
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!, 
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export default function Home() {
// useState: Estados para manejar el estado de la aplicación, como el archivo seleccionado, el progreso de carga, el estado de carga, la visibilidad del modal y los mensajes de error.
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  // handleFileChange: Función que se ejecuta cuando se selecciona un archivo. Actualiza el estado file con el archivo seleccionado y resetea cualquier mensaje de error previo.
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
    setErrorMessage(false);
  };

  // handleRemoveFile: Función que resetea el estado del archivo, el progreso y los mensajes de error, permitiendo al usuario eliminar el archivo seleccionado.
  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setErrorMessage(false);
  };

  // handleUpload: Función asíncrona, sube el archivo a S3 usando el cliente configurado. Maneja el progreso de la carga y actualiza el estado del progreso y el estado de carga. Si la carga es exitosa, muestra un modal; si hay un error, muestra un mensaje de error.
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setErrorMessage(false);
    try {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
          Key: file.name,
          Body: file,
        },
        leavePartsOnError: false, // Opcional: elimina las partes cargadas si hay un error
        partSize: 5 * 1024 * 1024, // Opcional: tamaño de la parte (por defecto es 5 MB)
      });

      upload.on('httpUploadProgress', (progress) => {
        const loaded = progress.loaded ?? 0;
        const total = progress.total ?? 1;
        setProgress(Math.round((loaded / total) * 100));
      });

      await upload.done();

      // alert('Archivo subido con éxito');
      setShowModal(true);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setErrorMessage(true);
    } finally {
      setUploading(false);
    }
  };

  // handleCloseModal y handleAcceptModal: Funciones que cierran el modal y resetean el estado del archivo y el progreso, permitiendo al usuario empezar de nuevo.
  const handleCloseModal = () => {
    setFile(null);
    setProgress(0); 
    setShowModal(false);
  };

  const handleAcceptModal = () => {
    setFile(null);
    setProgress(0); 
    setShowModal(false);
  };

  return (
    <div className="text-white text-center min-h-screen flex flex-col items-center">
      <div className="pt-10">
        <div className="flex justify-center mb-2">
          <Image
            className="rounded-xl"
            src="/images/s3.png"
            width={80}
            height={80}
            alt="Amazon S3 logo"
            quality={100}
          />
        </div>
        <h1 className="text-3xl mb-10">
          Sube tus archivos a <span className="text-green-400">S3</span>
        </h1>
        {errorMessage && (
          <h1 className="text-3xl -mt-5 mb-10 text-red-600">
            Ha ocurrido un error en el servidor
          </h1>
        )}
        <input
          type="file"
          className="hidden"
          id="fileInput"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label htmlFor="fileInput" className={`bg-orange-400 text-xl mt-5 px-8 py-4 rounded-xl duration-200 hover:bg-orange-500 hover:scale-105 ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'} select-none`}>
          Elige tu archivo
        </label>
        {file && (
          <div className="flex flex-col items-center mt-4">
            <span className="text-lg">{file.name}</span>
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 mb-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <div className="flex mt-2">
              <button
                onClick={handleRemoveFile}
                className={`bg-red-500 text-xl px-4 py-2 rounded-xl duration-200 hover:bg-red-600 hover:scale-105 mr-2 ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={uploading}
              >
                Quitar archivo
              </button>
              <button
                onClick={handleUpload}
                className={`bg-blue-500 text-xl px-4 py-2 rounded-xl duration-200 hover:bg-blue-600 hover:scale-105 ${uploading ? 'animate-pulse' : ''}`}
                disabled={uploading}
              >
                {uploading ? 'Subiendo...' : 'Subir archivo'}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className='mt-auto bg-gray-800 text-white text-center w-full'>
        <h1> v 0.1 </h1>
      </div>
      {showModal && (
        <UploadModal onClose={handleCloseModal} onAccept={handleAcceptModal} />
      )}
    </div>
  );
}
