import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function SpotifyAuthCallback() {
    const [params, _] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = params.get("code");
        if (code) {
            localStorage.setItem("spotify_code", code);
            localStorage.removeItem("spotify_token_data");
        }

        navigate("/home");
    }, []);

    return (
        <>
        </>);
}