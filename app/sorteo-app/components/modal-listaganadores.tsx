"use client";
import app from "@/app/firestore";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ModalProps {
  setModalGanadores: (arg0: any) => void;
}

const ModalListaGanadores: React.FC<ModalProps> = ({ setModalGanadores }) => {
  const [ganadores, setGanadores] = useState<string[]>([]);

  const handleOnclose = () => {
    setModalGanadores(false);
  };

  useEffect(() => {
    const getGanadores = async () => {
      const db = getFirestore(app);
      const ganadoresCollection = collection(db, "ganadores");
      try {
        const ganadoresSnapshot = await getDocs(ganadoresCollection);
        const ganadoresFromFirestore = ganadoresSnapshot.docs.map((doc) => doc.data().nombre);
        setGanadores(ganadoresFromFirestore);
      } catch (error) {
        console.error("Error ganadores Firestore:", error);
      }
    };
    getGanadores();
  }, []);

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
                className={`text-white text-xl w-auto animate-pulse uppercase tracking-widest grid grid-cols-3 gap-4`}
              >
                {ganadores.map((ganador: any, index: number) => (
                  <li key={index} className="flex items-center  justify-start  ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                      />
                    </svg>

                    <span className="inline-flex">{ganador}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={handleOnclose}
                className="absolute top-2 right-2 bg-gray-400 rounded-2xl py-1 px-2 hover:bg-gray-500 tranform transition duration-200 hover:translate-x-[2px] hover:translate-y-[2px] "
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalListaGanadores;
