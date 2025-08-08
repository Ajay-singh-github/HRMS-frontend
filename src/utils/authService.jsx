import { apiClient } from "./FetchNodeService";
export const verifyToken = async () => {
  try {
    const res = await apiClient('GET','/admin/verify/verify');
    console.log("Token verification result:", res);
    return res;
  } catch (err) {
    return null;
  }
};
