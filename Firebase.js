import * as firebase from 'firebase';


let firebaseConfig = {
    apiKey: "AIzaSyA3P4ParmZmw89N80Ow-zDWcBna_saL1_U",
    authDomain: "swap-eb68d.firebaseapp.com",
    databaseURL: "https://swap-eb68d.firebaseio.com",
    projectId: "swap-eb68d",
    storageBucket: "swap-eb68d.appspot.com",
    messagingSenderId: "655639433389",
    appId: "1:655639433389:web:dacba97ac67ca311233624",
    measurementId: "G-DNEDT77MFC"
};
firebase.initializeApp(firebaseConfig);

export default firebase;