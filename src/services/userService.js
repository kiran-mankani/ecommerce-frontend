import api from "./api";

export const getMeApi = () =>
  api.get("/users/me").then((r) => r.data);

export const getProfileApi = () =>
  api.get("/users/profile").then((r) => r.data);

export const updateProfileApi = (payload) =>
  api.put("/users/profile", payload).then((r) => r.data);

export const changePasswordApi = (payload) =>
  api.put("/users/change-password", payload).then((r) => r.data);

export const logoutApi = () =>
  api.post("/users/logout").then((r) => r.data);