import "../ui/discover.css";

type Artist = {
  id: number;
  artistImage: string;
  artistsAlt: string;
  artistName: string;
  artistCategory: string;
};

const artistItems: Artist[] = [
  {
    id: 1,
    artistImage: "/img/woman-face-icon.jpg",
    artistsAlt: "SPoooky artist",
    artistName: "John Due",
    artistCategory: "AI 3D Artist",
  },

  {
    id: 2,
    artistImage: "/img/white-t-shirts-woman.jpg",
    artistsAlt: "SPoooky artist2",
    artistName: "Kate Wilson",
    artistCategory: "Caligraphic Artist",
  },

  {
    id: 3,
    artistImage: "/img/man-picture.jpg",
    artistsAlt: "SPoooky artist",
    artistName: "Josh Adams",
    artistCategory: "Photographic Artist",
  },

  {
    id: 4,
    artistImage: "img/artists-face-woma-blue.jpg",
    artistsAlt: "SPoooky artist2",
    artistName: "Michel Smith",
    artistCategory: "AI creator",
  },

  {
    id: 5,
    artistImage: "/img/black-shirts-man.jpg",
    artistsAlt: "SPoooky artist",
    artistName: "Daniel Craig",
    artistCategory: "Animator",
  },

  {
    id: 6,
    artistImage: "/img/black-shirts-man2.jpg",
    artistsAlt: "SPoooky artist2",
    artistName: "Erin Johnson",
    artistCategory: "AI 3D Artist",
  },
];

export default function DiscoverSlider() {
  return (
    <div className="discover-slider-wrapper">
      <div className="discover-slider ">
        {artistItems.map((item: Artist) => (
          <div className="artist-cards relative group" key={item.id}>
            <img
              className="w-full aspect-[9/12.6] object-cover "
              src={item.artistImage}
              alt={item.artistsAlt}
            />
            <div className="  absolute bottom-0 left-0 w-full py-3 text-center hidden group-hover:flex flex-col bg-gradient-to-t from-black/80 via-black/80 to-transparent rounded-b-2xl items-center justify-center gap-1">
              <p className=" text-white text-sm font-semibold line-clamp-2">
                {item.artistName}
              </p>

              <p className=" text-white text-sm font-semibold line-clamp-2">
                #{item.artistCategory}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
