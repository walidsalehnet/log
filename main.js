import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { initializeApp } from "firebase/app";
import Swal from 'sweetalert2';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// إعداد reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier('sendVerificationCode', {
    size: 'invisible',
    callback: (response) => {
        console.log('reCAPTCHA solved:', response);
    },
    'expired-callback': () => {
        console.error('reCAPTCHA expired');
    }
}, auth);

// إرسال رسالة تحقق عبر Twilio
function sendVerificationCode() {
    const phoneNumber = document.getElementById('phone').value;

    // إرسال طلب HTTP POST إلى دالة Firebase لإرسال رسالة Twilio
    fetch('https://[YOUR_REGION].firebaseapp.com/sendTwilioSMS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            message: 'Ahoy 👋'  // الرسالة التي سيتم إرسالها
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Code Sent', 'A verification code has been sent to your phone.', 'success');
        } else {
            Swal.fire('Error', data.error, 'error');
        }
    })
    .catch(error => {
        Swal.fire('Error', 'Failed to send SMS.', 'error');
    });
}

// التحقق من رمز التحقق وإنشاء الحساب
function verifyCodeAndSignUp() {
    const code = document.getElementById('verificationCode').value;

    window.confirmationResult.confirm(code)
        .then((result) => {
            const user = result.user;

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const username = document.getElementById('username').value;

            user.updateProfile({ displayName: username }).then(() => {
                Swal.fire('Success', 'Account Created Successfully!', 'success');
            });
        })
        .catch(() => Swal.fire('Invalid Code', 'The verification code is incorrect.', 'error'));
}

// تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => Swal.fire('Welcome!', 'Login Successful!', 'success'))
        .catch((error) => Swal.fire('Error', error.message, 'error'));
}

// تسجيل الدخول باستخدام الهاتف
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
