import axios from "axios";
// const BASE_URL = 'http://localhost:5000/api'
const BASE_URL='https://api.developerajay.diy'
function createAxiosClient() {
  return async function (method, endpoint, body, isFormData = false) {
    const url =BASE_URL+ (endpoint ? endpoint : "")
        

    const config = {
      method,
      url,
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
      withCredentials: true,
      data: body,
    };

    try {
      const response = await axios(config);
      return {
        status: response.status,
        ok: response.status >= 200 && response.status < 300,
        ...response.data,
      };
    } catch (error) {
      console.error("Axios error:", error.message);
      if (error.response?.data?.message) {
        throw error.response.data.message;
      }
      throw error;
    }
  };
}

export const apiClient = createAxiosClient();
