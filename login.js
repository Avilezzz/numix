import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Configuración de Firebase (usa la misma que en admin.js)
const firebaseConfig = {
  apiKey: "AIzaSyDPRRTmC_kOR0pbupMAEdgsLOKmRJE1a-E",
  authDomain: "numix-rec.firebaseapp.com",
  projectId: "numix-rec",
  storageBucket: "numix-rec.appspot.com",
  messagingSenderId: "947381877553",
  appId: "1:947381877553:web:8ed82864760b416d968e10"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Usuario autenticado correctamente
    window.location.href = 'admin.html';
  } catch (error) {
    console.error("Error de autenticación:", error);
    errorMessage.textContent = "Credenciales incorrectas. Por favor intente nuevamente.";
  }
});