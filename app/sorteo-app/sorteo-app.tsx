"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Modal from "./components/modal";
import ModalListaGanadores from "./components/modal-listaganadores";
import Image from "next/image";
import logo from "@/public/assets/Logo.png";
import { useDropzone } from "react-dropzone";

export default function SorteoApp() {
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [ganadores, setGanadores] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalganadores, setModalGanadores] = useState(false);
  const [ganador, setGanador] = useState<string>("");

  useEffect(() => {
    // Cargar participantes desde sessionStorage al iniciar la aplicación
    const participantesGuardados = JSON.parse(sessionStorage.getItem("participantes") || "[]");
    setParticipantes(participantesGuardados);

    // Cargar ganadores desde sessionStorage al iniciar la aplicación
    const ganadoresGuardados = JSON.parse(sessionStorage.getItem("ganadores") || "[]");
    setGanadores(ganadoresGuardados);

    setLoading(false);
  }, []);

  useEffect(() => {
    // Obtén ganadores desde sessionStorage después de limpiar
    const ganadoresGuardados = JSON.parse(sessionStorage.getItem("ganadores") || "[]");
    setGanadores(ganadoresGuardados);
  }, []);

  const handleLimpiarGanadores = () => {
    sessionStorage.removeItem("ganadores");
    setGanadores([]);
  };

  const sortearGanador = () => {
    if (participantes.length === 0) {
      return;
    }

    // Selecciona un ganador
    const ganadorIndex = Math.floor(Math.random() * participantes.length);
    const nuevoGanador = participantes[ganadorIndex];

    // Elimina al ganador de la lista de participantes
    const nuevosParticipantes = participantes.filter((nombre) => nombre !== nuevoGanador);
    setParticipantes(nuevosParticipantes);
    sessionStorage.setItem("participantes", JSON.stringify(nuevosParticipantes));

    // Actualiza el estado de ganadores en el componente
    setGanadores([...ganadores, nuevoGanador]);
    sessionStorage.setItem("ganadores", JSON.stringify([...ganadores, nuevoGanador]));

    // Muestra el modal con el ganador
    setGanador(nuevoGanador);
    setShowModal(true);
  };

  const onDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        const nuevosParticipantes = content.split(",").map((nombre: String) => nombre.trim());

        // Actualizar estado local y sessionStorage
        setParticipantes([...participantes, ...nuevosParticipantes]);
        sessionStorage.setItem(
          "participantes",
          JSON.stringify([...participantes, ...nuevosParticipantes])
        );
      };

      reader.readAsText(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-20 select-none">
        {" "}
        <Image src={logo} alt="logo" width={200} height={0} />
        <div className="animate-pulse text-xl uppercase tracking-widest text-center ">
          Cargando Nuestra Raffle App, Por favor aguarda...
        </div>
      </div>
    );
  }

  const handleModalGanadores = () => {
    setModalGanadores(!modalganadores);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24 antialiased max-w-screen ">
      <Image src={logo} alt="logo" width={100} height={0} className="w-12 md:w-auto" />

      <h2 className="mb-4">Participantes:</h2>
      <div className="md:w-96 w-64 p-8 border border-white/20 shadow-md shadow-white/40 rounded-3xl">
        <ul className="max-h-96 overflow-y-auto ">
          {participantes.map((nombre, index) => (
            <li key={index}>{nombre}</li>
          ))}
        </ul>
      </div>

      {showModal && ganador?.length > 0 && (
        <Modal
          ganador={ganador}
          onClose={() => setShowModal(false)}
          handleLimpiarGanadores={handleLimpiarGanadores}
        />
      )}

      {/* Confetis */}
      {showModal && ganador?.length > 0 && (
        <div className="z-40 brightness-200 absolute top-0 left-0 contrast-200">
          <Confetti numberOfPieces={200} />
        </div>
      )}

      {modalganadores && (
        <ModalListaGanadores
          handleLimpiarGanadores={handleLimpiarGanadores}
          setModalGanadores={setModalGanadores}
          ganadores={ganadores}
        />
      )}

      <div className="flex gap-8 pt-8">
        <div
          {...getRootProps()}
          className={`border border-dashed border-white/20 p-4 rounded-3xl ${
            isDragActive ? "border-blue-500" : ""
          }`}
        >
          <input {...getInputProps()} accept=".txt" />
          {isDragActive ? (
            <p>Suelta los archivos aquí...</p>
          ) : (
            <p className="text-xs md:text-base">
              Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos
            </p>
          )}
        </div>
        <button
          onClick={sortearGanador}
          className="border w-auto h-10 border-white/20 shadow-md shadow-white/20 rounded-3xl py-1 px-4 transform duration-200 transition ease-in-out hover:translate-y-[2px]"
        >
          Sortear
        </button>
        <button
          onClick={handleModalGanadores}
          className="absolute bottom-4 md:right-4 right-1/2 translate-x-1/2  md:translate-x-0 z-50 border border-white/20 shadow-md shadow-white/20 rounded-3xl py-1 px-4 w-64 transform duration-200 transition ease-in-out hover:translate-y-[2px]"
        >
          Lista de Ganadores
        </button>
      </div>
    </main>
  );
}
