# MusicTagger
This is the frontend application for MusicTagger.

MusicTagger is an application that allows you to add your own tags to songs from your Spotify library. You can then export playlists to Spotify based on any selection of tags.

# Technologies used
- React
- Vite
- React Router

# Deploying
> [!WARNING]
> Before running the application, make sure to set the correct URLs for the MusicTagger backend API calls. They are currently set to `http://localhost:5172`.
>
> You'll also need to ensure that this application is running on `http://localhost:5173` because the Spotify application is currently configured to only accept that as a callback URL. Alternatively, you can set your own Spotify client ID and callback URL if you create your own Spotify application.

Run `npm run dev` for a dev build and `npm run start` for a production build.

# To-do list
- Fetch more of the user's liked songs from Spotify (currently limited to first 20)
- Read API base URLs and Spotify client ID from environment files
- Implement delete tag functionality
- Add auto suggestions for tag names based off currently typed tag name (when assigning tags to a track)
- Add ability to create, assign, and delete tags from the home page (currently on separate pages)
- Custom tag colors
