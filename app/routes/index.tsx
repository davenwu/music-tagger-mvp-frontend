import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";

export default function Index() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("music_tagger_token");
        if (token) navigate("/home");
    }, []);

    return (
        <>
            <h3>MusicTagger</h3>
            <br />
            <button><NavLink to="login">Log in</NavLink></button>
        </>);
}