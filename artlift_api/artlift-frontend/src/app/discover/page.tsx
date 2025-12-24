import Navigation from "../components/nav/navigation";
import "../components/ui/discover.css";
import DiscoverCard from "../components/cards/Discover";
import DiscoverSlider from "../components/features/DiscoverSlide";

export default function ArtworkDetails() {
  return (
    <>
      <h1>Discover</h1>
      <p className="text-gray-400">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      </p>
      <Navigation />

      <div className="category-container">
        <div className="category-collctions">
          <button className="category-button" type="button">
            Category
          </button>
          <button className="collection-button" type="button">
            Collection
          </button>
        </div>
        <button type="button">Filter & Sort</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <DiscoverCard />
      </div>

      <div className="m-5">
        <div className="artist-title-container">
           <h2>Artists</h2>
           <button type="button">View All</button>
           
        </div>
       
        <DiscoverSlider />
      </div>
    </>
  );
}
