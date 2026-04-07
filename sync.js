import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDIOT3eym4lqX0wPNKIFwwuKGzjlofyaPM",
    authDomain: "barthelemy-transport.firebaseapp.com",
    databaseURL: "https://barthelemy-transport-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "barthelemy-transport",
    storageBucket: "barthelemy-transport.firebasestorage.app",
    messagingSenderId: "430598535240",
    appId: "1:430598535240:web:6261039803e0ae7be4407d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- LOGIQUE CLOUD-FIRST ---

// 1. Écouter les changements sur le Cloud et mettre à jour le local
const colisRef = ref(db, 'colis');
onValue(colisRef, (snapshot) => {
    const data = snapshot.val();
    const list = data ? Object.values(data) : [];
    localStorage.setItem('bt_colis_data', JSON.stringify(list));
    
    // Déclencher une mise à jour de l'UI si la fonction existe sur la page
    if (typeof updateDashboardStats === "function") updateDashboardStats();
    if (typeof initInventory === "function") initInventory();
});

// 2. Fonction pour envoyer un nouveau colis au Cloud
window.saveColisToCloud = function(colisData) {
    const newColisRef = push(ref(db, 'colis'));
    colisData.id = newColisRef.key; // On utilise l'ID généré par Firebase
    return set(newColisRef, colisData);
};

// 3. Fonction pour mettre à jour un colis existant (ex: Livraison)
window.updateColisStatusCloud = function(colisId, updates) {
    const specificColisRef = ref(db, `colis/${colisId}`);
    // Note: Dans une version avancée, on utiliserait update() au lieu de set()
    // mais pour simplifier la structure Cloud-First :
    let allColis = JSON.parse(localStorage.getItem('bt_colis_data') || "[]");
    let target = allColis.find(c => c.id === colisId);
    if(target) {
        Object.assign(target, updates);
        set(ref(db, `colis/${colisId}`), target);
    }
};
