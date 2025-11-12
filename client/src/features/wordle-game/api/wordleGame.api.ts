// --- api ---
import axiosClient from "../../../api/axiosClient";

// --- endpoints ---
import { ENDPOINTS } from "../../../api/endpoints";

export const wordleGameApi = {
  start: () =>
    axiosClient
      .post(ENDPOINTS.START, {}, { withCredentials: true })
      .then((res) => res.data),
  guess: (guess: string) =>
    axiosClient
      .post(ENDPOINTS.GUESS, { guess }, { withCredentials: true })
      .then((res) => res.data),
};
