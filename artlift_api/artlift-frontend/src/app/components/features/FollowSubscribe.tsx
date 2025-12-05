import "../ui/subscribe_button.css";

export default function FollowSubscribe(){
  return(
    <>
    <div className="icon-name">
      <img src="./img/woman-face-icon.jpg" width={60} height={60} alt="follow icon"></img>
      <h3>John Due</h3>
    </div>

    <div className="follow-subscribe-buttons">
      <button className="follow-button" type="button">Follow</button>
      <button className="subscribe-button" type="button">Subscribe</button>
    </div>
      
    </>
  )
}