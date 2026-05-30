import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { message } from "antd";
import useAuthStore from "@/store/authStore";

interface GoogleTokenPayload {
    email: string;
    name: string;
    given_name?: string;
    family_name?: string;
    sub: string;
    picture: string;
    email_verified: boolean;
}

export const useGoogleAuth = (handleCloseLoginModal?: () => void) => {
    const { setAccessToken } = useAuthStore();

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            message.error("Google login failed: No credential received");
            return;
        }

        try {
            const decoded = jwtDecode<GoogleTokenPayload>(credentialResponse.credential);

            const payload = {
                email: decoded.email,
                firstName: decoded.given_name || decoded.name?.split(" ")[0] || "",
                lastName: decoded.family_name || decoded.name?.split(" ").slice(1).join(" ") || "",
                username: decoded.email.split("@")[0],
                role: "user",
                google: {
                    sub: decoded.sub,
                    picture: decoded.picture,
                    emailVerified: decoded.email_verified,
                },
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/google/one-tap`,
                payload,
                { withCredentials: true }
            );

            if (response.status === 201 || response.status === 200) {
                message.success(response.data.message || "Logged in successfully!");
                setAccessToken(response.data.access_token);
                if (handleCloseLoginModal) {
                    handleCloseLoginModal();
                }
            }
        } catch (error: any) {
            console.error("Google Auth Error:", error);
            const errorMessage = error.response?.data?.message || "Authentication failed";
            message.error(errorMessage);
        }
    };

    const handleGoogleError = () => {
        message.error("Google authentication failed");
    };

    return { handleGoogleSuccess, handleGoogleError };
};
