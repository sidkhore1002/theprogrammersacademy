import { api } from "../lib/api";

export type RegistrationPayload = {
  name: string;
  email: string;
  phone: string;
  education: string;
  address: string;
  courseId: string;
  registrationDate: string;
};

export type RegistrationResponse = RegistrationPayload & { id: number };

export function createRegistration(payload: RegistrationPayload) {
  return api.post<RegistrationResponse>("/registrations", payload);
}
