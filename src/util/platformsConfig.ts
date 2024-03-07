import { Stream } from "./stream"
import plaforms from "../../platforms.json";
import { Video } from "./video";

interface Platforms {
    liveStreams: Stream[],
    videos: Video[],
    shorts: Video[],
    upcomming: Stream[]
}

function convertVideo(video: typeof plaforms.Videos[0] | typeof plaforms.LiveStreams[0] | typeof plaforms.Shorts[0]): Video {
    return {
        length: video.Length,
        publishedAt: new Date(video.PublishedAt),
        title: video.Title,
        videoLink: video.VideoLink
    }
}

function convertLiveStream(video: typeof plaforms.LiveStreams[0]): Stream {
    return {
        ...convertVideo(video),
        liveStreamDate: new Date(video.LiveStreamDate),
    }
}

export const platformsConfig: Platforms = {
    videos: plaforms.Videos.map(convertVideo),
    liveStreams: plaforms.LiveStreams.map(convertLiveStream), 
    shorts: plaforms.Shorts.map(convertVideo), 
    upcomming: plaforms.Upcomming.map(convertLiveStream)
};