import { NavLink, Outlet } from "react-router";

export default function LoggedInHeader() {
    function logOut() {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_code_verifier");
        localStorage.removeItem("music_tagger_token");
    }

    return (
        <>
            <header className="grid-row mb-10">
                <NavLink to="/home" className="mx-2 px-2 outline-1">Home</NavLink>
                <NavLink to="/create_tag" className="mx-2 px-2 outline-1">Create Tag</NavLink>
                <NavLink to="/view_tags" className="mx-2 px-2 outline-1">View Tags</NavLink>
                <NavLink to="/generate_playlist" className="mx-2 px-2 outline-1">Generate Playlist</NavLink>
                <NavLink to="/" className="self-end px-2 outline-1" onClick={logOut}>Log Out</NavLink>
            </header>
            <Outlet />
        </>);
}