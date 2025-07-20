import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("login", "routes/login.tsx"),
    layout("components/layouts/logged-in-header.tsx", [
        route("home", "routes/home.tsx"),
        route("create_tag", "routes/create-tag.tsx"),
        route("view_tags", "routes/view-tags.tsx"),
        route("generate_playlist", "routes/generate-playlist.tsx"),
    ]),
    route("spotify-auth-callback", "routes/spotify-auth-callback.tsx")
] satisfies RouteConfig;
