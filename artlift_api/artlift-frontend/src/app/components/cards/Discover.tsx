import DiscoverSlider from "../features/DiscoverSlide";
import "../ui/discover.css";

type ArtistInfo = {
  id: number;
  artistIcon: string;
  artistName: string;
  artworkSrc: string;
};

const artistInfo: ArtistInfo[] = [
  {
    id: 1,
    artistIcon: "/img/white-t-shirts-woman.jpg",
    artistName: "SOki Tabata",
    artworkSrc:
      "https://img.freepik.com/free-vector/eclectus-parrot_53876-75777.jpg",
  },

  {
    id: 2,
    artistIcon: "/img/man-picture.jpg",
    artistName: "Josh Adams",
    artworkSrc:
      "https://img.freepik.com/free-photo/funereal-cockatoo-calyptorhynchus-funereus-illustrated-by-elizabeth-gould_53876-65555.jpg",
  },

  {
    id: 1,
    artistIcon: "",
    artistName: "",
    artworkSrc:
      "https://canvas.saatchiart.com/wp-content/uploads/2025/10/AriyaWatty-260-1020x500.jpg",
  },

  {
    id: 1,
    artistIcon: "",
    artistName: "",
    artworkSrc:
      "https://canvas.saatchiart.com/wp-content/uploads/2025/10/AriyaWatty-260-1020x500.jpg",
  },

  {
    id: 1,
    artistIcon: "",
    artistName: "",
    artworkSrc:
      "https://canvas.saatchiart.com/wp-content/uploads/2025/10/AriyaWatty-260-1020x500.jpg",
  },
];

const DiscoverCard = () => {
  return (
    <>
      {artistInfo.map((artist: ArtistInfo) => (
        <li className="shadow-lg shadow-gray-300 rounded-2xl pb-0 group">
          <a href="#">
            <div className="mt-3 relative aspect-[9/12.6] overflow-hidden rounded-2xl">
              <img
                src={artist.artworkSrc}
                className="w-full h-full object-cover rounded-2xl relative z-0 rounded-lg scale-110 transition-all duration-300 hover:scale-100 hover:opacity-75"
              />
              <div className="  absolute bottom-0 left-0 w-full py-3 text-center hidden group-hover:flex bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-b-2xl items-center justify-center gap-3">
                <img
                  src={artist.artistIcon}
                  alt="Artist Icon"
                  className=" w-11 h-11  mb-1 object-cover rounded-full"
                />
                <p className=" text-white text-sm font-semibold line-clamp-2">
                  {artist.artistName}
                </p>
              </div>
            </div>
          </a>
        </li>
      ))}
    </>
  );
};

export default DiscoverCard;
