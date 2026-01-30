
export type Artwork = {
  id: number;
  thumbnail: string;
  reviewCount: number;
  rating: number; // 0〜5
};

export type ArtistDetail = {
  id: number;
  artistIcon: string;
  artistName: string;
  artworkSrc: string;
  artistThumbnail: string;
  popularArtworks:Artwork[];
  aboutPicture:string;
  aboutText:string;
};


export const artistData: ArtistDetail[] = [
  {
    id: 1,
    artistIcon: "/img/white-t-shirts-woman.jpg",
    artistName: "SOki Tabata",
    artworkSrc: "/img/john-doe-artwork.jpg",
    aboutPicture:"/img/about-artist.jpg",
    aboutText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ( get from profile)",
    artistThumbnail: "/img/john-due-thumbnail-picture.jpg",
    popularArtworks:[
         {
        id: 101,
        thumbnail: "/img/artwork/artwork1.jpg",
        rating: 4.5,
        reviewCount: 32,
      },
      {
        id: 102,
        thumbnail: "/img/artwork/artwork2.jpg",
        rating: 4.0,
        reviewCount: 18,
      },
      {
        id: 103,
        thumbnail: "/img/artwork/artwork3.jpg",
        rating: 5,
        reviewCount: 54,
      },
      {
        id: 104,
        thumbnail: "/img/artwork/artwork4.jpg",
        rating: 3.5,
        reviewCount: 9,
      },
    ]
  },

];
