interface Result {
    success: boolean;
    result: string;
}

export interface Tag {
    tagId: number;
    tagName: string;
}

export interface TrackTag {
    tagId: number;
    spotifyTrackId: string;
}

export async function authenticate(formData: FormData, shouldLogin: boolean = true)
    : Promise<Result> {
    try {
        // TODO read base urls from environment file
        const url = shouldLogin ?
            "http://localhost:5172/api/auth/login" :
            "http://localhost:5172/api/auth/register";
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            var body = await response.json();
            var token = body.token;

            if (token) {
                return { success: true, result: token };
            } else {
                console.error(`failed to parse: ${body}`);
                return { success: false, result: `Unable to parse token` };
            }
        }
        else {
            const body = await response.text();
            return { success: false, result: body };
        }
    }
    catch (e: unknown) {
        if (e instanceof Error) console.error(e);

        return { success: false, result: `Error occurred when trying to authenticate` };
    }
}

export async function getUserTags(): Promise<Tag[]> {
    const token = localStorage.getItem("music_tagger_token");
    if (!token) return [];

    const url = "http://localhost:5172/api/tag";
    const response = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });

    if (response.ok) {
        const body = await response.json();

        if (Array.isArray(body)) return body;
    }

    return [];
}

export async function createTag(tagName: string) {
    const token = localStorage.getItem("music_tagger_token");
    if (!token) return [];

    const url = "http://localhost:5172/api/tag";
    const body = { "tagName": tagName };
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    return response.ok;
}

export async function getTrackTags(trackIds: string[]): Promise<TrackTag[]> {
    const token = localStorage.getItem("music_tagger_token");
    if (!token) return [];

    const url = "http://localhost:5172/api/tracktag?";
    const params = new URLSearchParams();

    trackIds.forEach(id => params.append("spotifyTrackIds", id));

    const response = await fetch(url + params.toString(), { headers: { "Authorization": `Bearer ${token}` } });

    if (response.ok) {
        const body = await response.json();

        if (Array.isArray(body)) return body;
    }

    return [];
}

export async function assignTrackTag(tagId: number, trackId: string): Promise<boolean> {
    const token = localStorage.getItem("music_tagger_token");
    if (!token) return false;

    const url = "http://localhost:5172/api/tracktag";
    const body = { tagId, spotifyTrackId: trackId };
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    return response.ok;
}

export async function getTracksByTags(tagIds: number[]): Promise<string[]> {
    const token = localStorage.getItem("music_tagger_token");
    if (!token) return [];

    const url = "http://localhost:5172/api/track?";
    const params = new URLSearchParams();
    tagIds.forEach(id => params.append("tagIds", id.toString()));

    const response = await fetch(url + params.toString(), { headers: { "Authorization": `Bearer ${token}` },
    });

    if (response.ok) {
        const body = await response.json();

        if (Array.isArray(body)) return body as string[];
    }

    return [];
}
