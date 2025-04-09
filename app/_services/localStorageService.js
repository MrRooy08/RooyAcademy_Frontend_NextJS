export const KEY_TOKEN = "accessToken";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN); // Trả về null nếu đang chạy trên server
};


export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};
