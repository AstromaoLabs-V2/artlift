import { Artwork } from "@/app/data/artists";
type Props = {
 aboutPicture: string;
  aboutText:string;
};

export default function ArtistAbout({ aboutPicture, aboutText }: Props) {
  return (
    <>
        <img
          className="object-cover w-full h-[300px] rounded-2xl"
          src={aboutPicture}
          alt={`Thumbnail ${aboutPicture}`}
        />
        <p className="w-1/2 pr-2 mt-3">{aboutText}</p>
    </>
  );
}