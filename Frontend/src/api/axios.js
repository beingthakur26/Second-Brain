// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000/api",
//     withCredentials: true, // 🔥 REQUIRED for cookies
// });

// export default api;


import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export default api;