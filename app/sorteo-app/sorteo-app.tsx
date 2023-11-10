"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Confetti from "react-confetti";
import Modal from "./components/modal";
import { uploadDataToFirestore, verificarDatosEnFirestore } from "../utils";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import app from "../firestore";
import ModalListaGanadores from "./components/modal-listaganadores";
import Image from "next/image";
import logo from "@/public/assets/Logo.png";

export default function SorteoApp() {
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [ganadores, setGanadores] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalganadores, setModalGanadores] = useState(false);
  const [ganador, setGanador] = useState<string>("");

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      const db = getFirestore(app);
      const ganadoresCollection = collection(db, "ganadores");
      const usuariosCollection = collection(db, "usuarios");

      try {
        // Obtener ganadores
        const ganadoresSnapshot = await getDocs(ganadoresCollection);
        const ganadoresFromFirestore = ganadoresSnapshot.docs.map((doc) => doc.data().nombre);
        setGanadores(ganadoresFromFirestore);

        // Obtener participantes
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const participantesMap = new Map<string, boolean>();

        usuariosSnapshot.docs.forEach((doc) => {
          const nombre = doc.data().nombre;
          participantesMap.set(nombre, true);
        });

        // Filtrar los ganadores de la lista de participantes
        const participantesFiltrados = Array.from(participantesMap.keys()).filter(
          (nombre) => !ganadores.includes(nombre)
        );

        setParticipantes(participantesFiltrados);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }
    };

    fetchDataFromFirestore();
  }, []);

  const sortearGanador = async () => {
    if (loading || participantes.length === 0) {
      return;
    }

    // Selecciona un ganador
    const ganadorIndex = Math.floor(Math.random() * participantes.length);
    const nuevoGanador = participantes[ganadorIndex];

    // Elimina al ganador de la lista de participantes
    setParticipantes(participantes.filter((nombre) => nombre !== nuevoGanador));

    try {
      // Agrega al ganador a la colección de ganadores en Firestore
      const db = getFirestore(app);
      const ganadoresCollection = collection(db, "ganadores");
      await addDoc(ganadoresCollection, {
        nombre: nuevoGanador,
        timestamp: serverTimestamp(),
      });

      // Actualiza el estado de ganadores en el componente
      setGanadores([...ganadores, nuevoGanador]);

      // Muestra el modal con el ganador
      setGanador(nuevoGanador);
      setShowModal(true);
    } catch (error) {
      console.error("Error al agregar ganador a Firestore:", error);
    }
  };

  const limpiarGanadores = () => {
    setGanadores([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-20 select-none">
        {" "}
        <Image src={logo} alt="logo" width={300} height={0} />
        <div className="animate-pulse text-4xl uppercase tracking-widest ">
          Cargando Nuestra Raffle App, Por favor aguarda...
        </div>
      </div>
    ); // Pantalla de carga
  }

  const handleModalGanadores = () => {
    setModalGanadores(!modalganadores);
  };
  return (
    <main className="flex min-h-screen flex-col  items-center justify-between p-24 ">
      <h1 className="text-3xl uppercase tracking-widest">Raffle App</h1>
      <div>
        <h2 className="mb-4">Participantes:</h2>
        <div className="w-96 p-8 border border-white/20 shadow-md shadow-white/40 rounded-3xl">
          {" "}
          <ul className="max-h-96 overflow-y-auto ">
            {participantes.map((nombre, index) => (
              <li key={index}>{nombre}</li>
            ))}
          </ul>
        </div>
      </div>
      {/*     <div>
        <h2>Ganadores:</h2>
        <ul>
          {ganadores.map((ganador, index) => (
            <li key={index} className="text-white">
              {ganador}
            </li>
          ))}
        </ul>
      </div> */}
      {/* Modal */}
      {showModal && ganador?.length > 0 && (
        <Modal
          ganador={ganador}
          onClose={() => setShowModal(false)}
          limpiarGanadores={limpiarGanadores}
        />
      )}

      {/* Confetis */}
      {showModal && ganador?.length > 0 && (
        <div className="z-40 brightness-200 absolute top-0 left-0 contrast-200">
          <Confetti numberOfPieces={200} />
        </div>
      )}

      {modalganadores && <ModalListaGanadores setModalGanadores={setModalGanadores} />}

      <div className="flex gap-8">
        {" "}
        <button
          onClick={sortearGanador}
          className="border border-white/20 shadow-md shadow-white/20 rounded-3xl py-1 px-4 w-36 transform duration-200 transition ease-in-out hover:translate-y-[2px]"
        >
          Sortear
        </button>
        <button
          onClick={handleModalGanadores}
          className="absolute bottom-4 right-4 z-50 border border-white/20 shadow-md shadow-white/20 rounded-3xl py-1 px-4 w-36 transform duration-200 transition ease-in-out hover:translate-y-[2px]"
        >
          {" "}
          Lista de Ganadores
        </button>
      </div>
    </main>
  );
}
