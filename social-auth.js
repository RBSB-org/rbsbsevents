// EventWale — shared social sign-in (Google, Facebook).
// Any element with data-social="google|facebook" becomes a sign-in button.
import { auth, googleProvider, facebookProvider } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const PROVIDERS = {
    google: { provider: googleProvider, label: "Google" },
    facebook: { provider: facebookProvider, label: "Facebook" }
};

function friendlyError(error, label) {
    const messages = {
        "auth/popup-closed-by-user": `${label} sign-in was cancelled. Please try again.`,
        "auth/cancelled-popup-request": "A sign-in window is already open. Please finish or close it first.",
        "auth/popup-blocked": `Your browser blocked the ${label} sign-in window. Allow pop-ups for this site and try again.`,
        "auth/unauthorized-domain": "This website domain is not authorised in Firebase (Authentication → Settings → Authorised domains).",
        "auth/operation-not-allowed": `${label} sign-in is not switched on yet. Enable it in Firebase Console → Authentication → Sign-in method.`,
        "auth/network-request-failed": "Network error. Check your internet connection and try again.",
        "auth/account-exists-with-different-credential":
            "An account already exists with this email using a different sign-in method. Log in with that method instead."
    };
    return messages[error && error.code] ||
        `${label} sign-in failed (${(error && error.code) || "unknown error"}). Please try again.`;
}

export function bindSocialButtons({ showMessage, redirectTo = "index.html" }) {
    const buttons = Array.from(document.querySelectorAll("[data-social]"));

    buttons.forEach(button => {
        const config = PROVIDERS[button.dataset.social];
        if (!config) return;

        button.addEventListener("click", async () => {
            buttons.forEach(b => { b.disabled = true; });
            showMessage(`Opening ${config.label} sign-in...`, false);

            try {
                await signInWithPopup(auth, config.provider);
                showMessage(`${config.label} sign-in successful! Redirecting...`, false);
                window.location.replace(redirectTo);
            } catch (error) {
                console.error(`${config.label} sign-in error:`, error);
                showMessage(friendlyError(error, config.label));
                buttons.forEach(b => { b.disabled = false; });
            }
        });
    });
}
