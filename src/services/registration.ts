import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Payload type for registration form
export type RegistrationPayload = {
  name: string;
  email: string;
  phone: string;
  education: string;
  address: string;
  courseId: string;
  registrationDate: string; // ISO string
};

// Response type after saving to Firestore
export type RegistrationResponse = RegistrationPayload & {
  id: string; // Firestore document ID
};

/**
 * Save registration data to Firestore
 * @param payload RegistrationPayload
 * @returns RegistrationResponse
 */
export async function createRegistration(
  payload: RegistrationPayload
): Promise<RegistrationResponse> {
  try {
    // Reference to 'registrations' collection
    const registrationsRef = collection(db, "registrations");

    // Save the document
    const docRef = await addDoc(registrationsRef, {
      ...payload,
      // Convert registrationDate to Firestore Timestamp
      registrationDate: Timestamp.fromDate(new Date(payload.registrationDate)),
    });

    return {
      ...payload,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error saving registration to Firestore:", error);
    throw new Error("Failed to save registration");
  }
}
