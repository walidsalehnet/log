import { getAuth, signInWithPhoneNumber } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDhd3l_1q-gNEeihQQY-5fpRvV9vCZgMYA",
    authDomain: "wedoo7.firebaseapp.com",
    projectId: "wedoo7",
    storageBucket: "wedoo7.firebasestorage.app",
    messagingSenderId: "176039023490",
    appId: "1:176039023490:web:693f81466bd00a8767f59b",
    measurementId: "G-Y3TLQ3CKYJ"
};
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth();

// reCAPTCHA verifier setup
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sendVerificationCode', {
    size: 'invisible', // Use 'normal' to show reCAPTCHA
    callback: (response) => {
        console.log('reCAPTCHA solved:', response); // On successful verification
    },
    'expired-callback': () => {
        console.error('reCAPTCHA expired'); // If reCAPTCHA expires
    }
});

// Send Verification Code
function sendVerificationCode() {
    const phoneNumber = document.getElementById('phone').value;

    // Use reCAPTCHA verifier
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            // Store confirmation result for later use
            window.confirmationResult = confirmationResult;
            Swal.fire('Code Sent', 'A verification code has been sent to your phone.', 'success');
        })
        .catch((error) => {
            Swal.fire('Error', error.message, 'error');
        });
}

// Verify Code and Sign Up
function verifyCodeAndSignUp() {
    const code = document.getElementById('verificationCode').value;

    window.confirmationResult.confirm(code)
        .then((result) => {
            const user = result.user;

            // Optionally link with email-password or update profile
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const username = document.getElementById('username').value;

            user.updateProfile({ displayName: username }).then(() => {
                Swal.fire('Success', 'Account Created Successfully!', 'success');
            });
        })
        .catch(() => Swal.fire('Invalid Code', 'The verification code is incorrect.', 'error'));
}

// Login with Email and Password
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => Swal.fire('Welcome!', 'Login Successful!', 'success'))
        .catch((error) => Swal.fire('Error', error.message, 'error'));
}

// Login with Phone
function loginWithPhone() {
    const phoneNumber = document.getElementById('loginPhone').value;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            const code = prompt('Enter the verification code:');
            return confirmationResult.confirm(code);
        })
        .then(() => Swal.fire('Welcome!', 'Login Successful!', 'success'))
        .catch((error) => Swal.fire('Error', error.message, 'error'));
}
