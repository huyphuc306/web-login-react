// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Thay thế các dòng dưới đây bằng thông tin từ Firebase Console của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDbE-uj5Eit_qHlN-2PUQwpzRT6uNGBVco",
  authDomain: "web-login-app-498a8.firebaseapp.com",
  projectId: "web-login-app-498a8",
  storageBucket: "web-login-app-498a8.firebasestorage.app",
  messagingSenderId: "92786827275",
  appId: "1:92786827275:web:a122609d1a24122bb1670e"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất Authentication và Provider để dùng ở file Login
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();