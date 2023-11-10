import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import app from './firestore';
const uploadDataToFirestore = async (participantesFromExcel: any) => {
    const db = getFirestore(app);
    const usuariosCollection = collection(db, 'usuarios');
  
    for (const participante of participantesFromExcel.slice(1)) {
      const [nombre, matricula = '', celular = '', dni = ''] = participante;
  
      // Verificar si el documento ya existe en la base de datos
      const existingDocument = await getDocs(query(usuariosCollection, where('nombre', '==', nombre)));
  
      if (!existingDocument.empty) {
        console.log(`El participante ${nombre} ya existe en la base de datos. No se agregará duplicado.`);
        continue; // Saltar a la siguiente iteración del bucle
      }
  
      try {
        await addDoc(usuariosCollection, {
          nombre,
          celular,
          matricula,
          dni,
          timestamp: serverTimestamp(),
        });
        console.log(`Participante ${nombre} agregado correctamente.`);
      } catch (error) {
        console.error('Error al agregar documento:', error);
      }
    }
  };
  
  export { uploadDataToFirestore };
  
  



// Después de cargar los datos en Firestore
export const verificarDatosEnFirestore = async () => {
    const db = getFirestore();
    const usuariosCollection = collection(db, 'usuarios');
  
    try {
      // Obtener todos los documentos de la colección 'usuarios'
      const snapshot = await getDocs(usuariosCollection);
  
      // Mostrar los datos en la consola
      snapshot.forEach((doc) => {
        console.log('ID:', doc.id, 'Datos:', doc.data());
      });
    } catch (error) {
      console.error('Error al obtener documentos de Firestore:', error);
    }
  };
  
  // Llamada a la función de verificación después de cargar los datos
  verificarDatosEnFirestore();





  // este use effect de backup se ejectua en el componente para cargar el bulk de usuario
    /*   useEffect(() => {
    const fetchDataAndUploadToFirestore = async () => {
      try {
        const response = await fetch("/assets/listado.xlsx");
        const arrayBuffer = await response.arrayBuffer();

        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const participantesFromExcel = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        });
        console.log("Datos obtenidos del Excel:", participantesFromExcel);
        await uploadDataToFirestore(participantesFromExcel);
        console.log("Datos cargados en Firestore exitosamente.");
      } catch (error) {
        console.error("Error durante la carga de datos:", error);
      }
    };

    fetchDataAndUploadToFirestore();
  }, []); */