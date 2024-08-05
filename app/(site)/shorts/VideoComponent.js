import { useEffect, useRef } from "react";
import { IoMdPause, IoMdPlay, IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import { RiShareForwardFill } from "react-icons/ri";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MdInsertComment } from "react-icons/md";

const VideoComponent = ({ video, isPlaying, mute, setMute, playingVideo, setPlayingVideo }) => {
	const videoRef = useRef(null);

	useEffect(() => {
		const video = videoRef.current;

		if (isPlaying) {
			video.play();
		} else {
			video.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		const handleResize = () => {
			const video = videoRef.current;
			const aspectRatio = 9 / 16;
			const width = video.parentElement.offsetWidth;
			const height = video.parentElement.offsetHeight;

			if (width / height > aspectRatio) {
				video.style.width = "100%";
				video.style.height = "auto";
			} else {
				video.style.width = "auto";
				video.style.height = "100%";
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="flex items-center justify-start cursor-pointer gap-4 h-[calc(100vh-2rem)]">
			<div className="relative h-full aspect-[9/16] rounded-xl max-w-[calc(100vw-2.5rem)] overflow-hidden">
				<video ref={videoRef} src={video.videoUrl} className="absolute top-0 left-0 object-cover w-full h-full" muted={mute} loop onClick={() => setPlayingVideo(isPlaying ? null : video.id)} />
				<div className="absolute top-0 left-0 right-0 flex justify-between p-4 text-white">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setPlayingVideo(isPlaying ? null : video.id);
						}}
						className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
					>
						{isPlaying ? <IoMdPause /> : <IoMdPlay />}
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setMute(!mute);
						}}
						className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
					>
						{mute ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
					</button>
				</div>
				<div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black to-transparent">
					<div className="flex items-center gap-2 mb-2">
						<img src={video.thumbnailUrl} alt={video.author} className="object-cover rounded-full w-9 h-9" />
						<p>{video.author}</p>
						<button className="px-2 py-1 ml-auto text-sm bg-blue-500 rounded">Subscribe</button>
					</div>
					<p className="text-sm">{video.title}</p>
					<p className="text-xs line-clamp-2">{video.description}</p>
				</div>
				<div className="absolute bottom-0 right-0 flex flex-col items-center p-4 space-y-4 text-white">
					<button className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75">
						<FaThumbsUp />
					</button>
					<button className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75">
						<FaThumbsDown />
					</button>
					<button className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75">
						<MdInsertComment />
					</button>
					<button className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75">
						<RiShareForwardFill />
					</button>
				</div>
			</div>
		</div>
	);
};

export default VideoComponent;
