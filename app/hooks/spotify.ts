import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { getAuthenticatedApi } from "~/spotify/auth";

export function useSpotifyApi() {
    const [sdk, setSdk] = useState<SpotifyApi | null>(null);

    useEffect(() => {
        (async () => {
            const sdk = await getAuthenticatedApi();

            if (sdk) setSdk(sdk);
        })();
    }, []);

    return sdk;
}
