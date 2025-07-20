import { useEffect, useState } from "react";
import TrackList, { type Track } from "~/components/track-list";
import { useSpotifyApi } from "~/hooks/spotify";
import { getTrackTags, getUserTags, type Tag } from "~/services/music-tagger-service";
import { redirectToSpotify } from "~/spotify/auth";

export default function Home() {
    const sdk = useSpotifyApi();
    const [loading, setLoading] = useState<boolean>(true);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [userTags, setUserTags] = useState<Tag[]>([]);

    useEffect(() => {
        (async () => {
            if (sdk) {
                try {
                    const profile = await sdk.currentUser.profile();
                    setDisplayName(profile.display_name);
                } catch {
                    setLoading(false);
                }

                const savedTracks = await sdk.currentUser.tracks.savedTracks();
                const tags = await getUserTags();

                setUserTags(tags);

                const trackTags = await getTrackTags(savedTracks.items.map(t => t.track.id));
                const tracks = savedTracks.items.map(t => t.track).map(t => {
                    return {
                        spotifyTrackId: t.id,
                        trackName: t.name,
                        artistNames: t.artists.map(a => a.name),
                        tags: trackTags.filter(tt => tt.spotifyTrackId == t.id).map(tt => {
                            const tag = tags.find(t => t.tagId == tt.tagId);
                            if (!tag) {
                                console.error(`no tag found with tag id ${tt.tagId}`);
                                return;
                            }

                            return {
                                tagId: tt.tagId,
                                tagName: tag.tagName
                            } as Tag
                        })
                    } as Track;
                });

                setTracks(tracks);
                setLoading(false);
            }
        })();
    }, [sdk]);

    return (
        <>
            {!loading && displayName &&
                <>
                    <p>Welcome, {displayName}</p>
                    <TrackList tracks={tracks} userTags={userTags} />
                </>
            }
            {!loading && !displayName &&
                <p>
                    It appears you haven't connected your Spotify account.
                    <br />
                    <span className="text-blue-100 hover:cursor-pointer" onClick={redirectToSpotify}>Connect Spotify account</span>
                </p>
            }
        </>);
}
