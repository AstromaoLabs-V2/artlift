import Navigation from "../../components/nav/navigation"
import ArtistClient from "./ArtistClient"

type Props = {
  params: {
    "artist-id": string
  }
}

export default function ArtistPage({ params }: Props) {
  return (
    <div className="artist-page-wrapper">
      <Navigation />
      <ArtistClient artistId={params["artist-id"]} />
    </div>
  )
}
