import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function saveHistory(userId, type, inputs, result) {
  try {
    await addDoc(collection(db, "history"), {
      userId,
      type, // "crop" | "fertilizer" | "disease"
      inputs,
      result,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Failed to save history:", e);
  }
}
