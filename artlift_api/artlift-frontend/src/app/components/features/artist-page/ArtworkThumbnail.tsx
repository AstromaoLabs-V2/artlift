import { Artwork } from "@/app/data/artists";

type Props = {
  artworkThumbnail: string;
};

export default function ArtworkThumbnail({ artworkThumbnail }: Props) {
  return (
    <>
        <img
          className="object-cover w-full h-full"
          src={artworkThumbnail}
          alt={`Thumbnail ${artworkThumbnail}`}
        />
    </>
  );
}
