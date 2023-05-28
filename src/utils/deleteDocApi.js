import { deleteDoc } from "firebase/firestore";

export const deleteDocApi = async (docRef) => {
  await deleteDoc(docRef);
};
