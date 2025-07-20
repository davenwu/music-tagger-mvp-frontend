import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { authenticate } from "~/services/music-tagger-service";

export default function Login() {
    const [showLogin, setShowLogin] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);

        const { success, result } = await authenticate(new FormData(event.currentTarget), showLogin);

        if (success) {
            localStorage.setItem("music_tagger_token", result);
            navigate("/home");
        } else {
            setError(result);
        }
    }

    return (
        <>
            <form onSubmit={submit}>
                <input type="text" name="username" placeholder="Username" />
                <br />
                <input type="password" name="password" placeholder="Password" />
                <br />
                {showLogin ?
                    <button type="button"><input type="submit" value="Log in" className="hover:cursor-pointer" /></button> :
                    <button type="button"><input type="submit" value="Register" className="hover:cursor-pointer" /></button>
                }
            </form >
            {showLogin ?
                <p>Don't have an account yet? <span className="text-blue-600 hover:cursor-pointer" onClick={() => setShowLogin(false)}>Sign Up</span></p> :
                <p>Already have an account? <span className="text-blue-600 hover:cursor-pointer" onClick={() => setShowLogin(true)}>Log in</span></p>
            }
            {error && <p className="text-red-600">{error}</p>}
        </>);
}


