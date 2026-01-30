## API Contract: Artists
- Purpose: Provide stable artist detail endpoint using Next.js frontend for artists pages and artwork lists.
Remember that "Artist information is here mainly. And try to get artwork data as FK. This database is used in management page and artist page
- Base path: /api/artists

###Artist information 

```code
artistIcon: string;
artistName: string;
artworkSrc: string;
 artistThumbnail: string;
 ```

 ##Artwork
 Currently, I am including popular artwork in same function in artists.ts page though, it should be in artwork database.

 ```
  popularArtworks:[
         {
        id: 101,
        thumbnail: "/img/artwork/artwork1.jpg",
        rating: 4.5,
        reviewCount: 32,
      },
  ]

  ```

