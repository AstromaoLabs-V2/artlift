import { artistData } from "@/app/data/artists";
import Navigation from "@/app/components/nav/navigation.tsx";
import "@/app/components/ui/artist_page_style.css";
import FollowSubscribe from "@/app/components/features/FollowSubscribe.tsx";
import ArtworkThumbnail from "@/app/components/features/artist-page/ArtworkThumbnail.tsx";
import FavoriteArtwork from "@/app/components/features/artist-page/FavoriteArtwork.tsx";
import ArtistAbout from "@/app/components/features/artist-page/ArtistAbout.tsx";
import MyArtworks from "@/app/components/features/artist-page/MyArtworks.tsx";

type ArtistDetail = {
  id: number;
  artistIcon: string;
  artistName: string;
  artworkSrc: string;
  artistThumbnail: string;
};

type Props = {
  params: Promise<{
    "artist-id": string;
  }>;
};

export default async function ArtistPage({ params }: Props) {
  const { "artist-id": artistId } = await params;
  const artistIdNumber = Number(artistId);
  const artists = artistData.find((artist) => artist.id === artistIdNumber);

  if (!artists) return <div>Artist not found</div>;

  return (
  
      <div className="artist-page-wrapper">
        <Navigation />
        <div className="relative w-full h-[350px]">
          <ArtworkThumbnail artworkThumbnail={artists.artistThumbnail} />
        </div>
        <div className="artist-icons-container flex items-center mt-4">
          <FollowSubscribe
            artistIcon={artists.artistIcon}
            artistName={artists.artistName}
          />
        </div>
        <div className="favorite-about-section mt-4">
          <FavoriteArtwork artworks={artists.popularArtworks} />
          <h2>About</h2>
          <div className="mt-4 relative w-full ">
            <ArtistAbout
              aboutPicture={artists.aboutPicture}
              aboutText={artists.aboutText}
            />
          </div>
        </div>
        <div className="my-artworks-section mt-8">
           <h2>My Artworks</h2>
        <MyArtworks artworks={artists.popularArtworks} />
        <div className="all-artwork-container">
          <button type="button">View All</button>
        </div>
        </div>
      </div>
 
  );
}
