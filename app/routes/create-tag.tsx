import type { FormEvent } from "react";
import { createTag } from "~/services/music-tagger-service";

export default function CreateTag() {
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const tagName = formData.get("tagName")?.toString();

        console.log(tagName);

        if (tagName) await createTag(tagName);
    }

    return (
        <>
            <form onSubmit={submit}>
                <input type="text" name="tagName" placeholder="Tag name" />
                <button type="submit" className="outline-1 px-1 rounded-sm hover:bg-gray-100">Create</button>
            </form>
        </>);
}