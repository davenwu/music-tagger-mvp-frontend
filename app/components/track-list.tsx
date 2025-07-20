import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { assignTrackTag, type Tag } from "~/services/music-tagger-service";

interface TrackListProps {
    tracks: Track[];
    userTags: Tag[];
}

export interface Track {
    spotifyTrackId: string;
    trackName: string;
    artistNames: string[];
    tags: Tag[];
}

export function addTagButton(userTags: Tag[], trackId: string) {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const navigate = useNavigate();

    async function addTag(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key == "Enter") {
            const tagName = event.currentTarget.value;
            const tagId = userTags.find(t => t.tagName == tagName)?.tagId;

            if (!tagId) {
                setIsAdding(false);
                return;
            }

            const assigned = await assignTrackTag(tagId, trackId);
            if (assigned) {
                navigate(0);
            }

            setIsAdding(false);
        }
    }

    function onClick() {
        setIsAdding(true);
    }

    function onBlur() {
        setIsAdding(false);
    }

    return (
        <>
            {!isAdding &&
                <button onClick={onClick} className="mx-1 px-1 rounded-sm outline-1 outline-gray-400 hover:cursor-pointer hover:bg-gray-100">
                    +
                </button >
            }
            {isAdding &&
                <input type="text" name="new_tag_name" autoFocus onBlur={onBlur} onKeyDown={addTag} />
            }
        </>);
}

export default function TrackList({ tracks, userTags }: TrackListProps) {
    function trackTagItems(track: Track) {
        return track.tags.map(tag => <button key={`${track.spotifyTrackId}-${tag.tagId}`} className="mx-1 px-3 rounded-sm outline-1 outline-[#ff00ff] hover:bg-gray-100 hover:ps-1.75 hover:pe-4.25">{tag.tagName}</button>);
    }

    const trackItems =
        <ul>
            {tracks.map(track =>
                <li key={track.spotifyTrackId} className="my-4">"{track.trackName}" by {track.artistNames.join(", ")} {trackTagItems(track)} {addTagButton(userTags, track.spotifyTrackId)}</li>)
            }
        </ul>;

    return (
        <>
            <p>Track List</p>
            {trackItems}
        </>);
}
