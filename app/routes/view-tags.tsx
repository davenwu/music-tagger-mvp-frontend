import { useEffect, useState } from "react";
import { getUserTags, type Tag } from "~/services/music-tagger-service";

async function deleteTag(tagId: number) {
    console.log(`deleting tag id ${tagId}`);
}

export default function viewTags() {
    const [tags, setTags] = useState<Tag[]>();

    useEffect(() => {
        (async () => {
            const tags = await getUserTags();

            console.log(tags);

            setTags(tags);
        })();
    }, []);

    return (
        <ul className="flex">
            {tags && tags.map(t =>
                <li className="mx-2 px-2 outline-1 rounded-sm">
                    {t.tagName}
                    <span onClick={() => deleteTag(t.tagId)} className="ms-2 hover:cursor-pointer">x</span>
                </li>)}
        </ul>);
}