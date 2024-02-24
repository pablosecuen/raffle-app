import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ModalProps {
  setModalGanadores: (arg0: any) => void;
  handleLimpiarGanadores: () => void;
  ganadores: string[];
}

const ModalListaGanadores: React.FC<ModalProps> = ({
  setModalGanadores,
  handleLimpiarGanadores,
  ganadores,
}) => {
  const handleOnclose = () => {
    setModalGanadores(false);
  };

  // Calcular el número de columnas dinámicamente
  const numColumnas = Math.ceil(ganadores.length / 10);

  return (
    <AnimatePresence>
      {ganadores && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="bg-black/80 absolute z-30 w-screen h-screen top-0 left-0 "
            onClick={handleOnclose}
          ></motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="modal-overlay z-50 bg-black fixed w-[80vw]  max-h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-500/20 shadow-xl shadow-gray-200/20 "
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 2 }}
              className="modal relative w-auto h-full flex flex-col justify-center place-items-center p-10"
            >
              <h2 className="pb-8 uppercase tracking-widest text-2xl">Ganadores:</h2>
              <ol
                className={`text-white text-xl w-auto animate-pulse uppercase tracking-widest grid grid-cols-${numColumnas} gap-4`}
              >
                {ganadores.map((ganador: any, index: number) => (
                  <li key={index} className="flex items-center  justify-start  ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      {/* ... Icono ... */}
                    </svg>

                    <span className="inline-flex">{ganador}</span>
                  </li>
                ))}
              </ol>
              <div className="absolute top-2 right-2 flex gap-10">
                {" "}
                <button
                  onClick={handleLimpiarGanadores}
                  className=" bg-gray-400 rounded-2xl text-xs md:text-base py-1 px-2 hover:bg-gray-500 tranform transition duration-200 hover:translate-x-[2px] hover:translate-y-[2px] "
                >
                  Limpiar Ganadores
                </button>
                <button
                  onClick={handleOnclose}
                  className=" bg-gray-400 rounded-2xl py-1 px-2 text-xs md:text-base hover:bg-gray-500 tranform transition duration-200 hover:translate-x-[2px] hover:translate-y-[2px] "
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalListaGanadores;
