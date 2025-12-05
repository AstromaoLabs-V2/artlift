export default function SnsSystem() {
  return (
    <>
      <h2 className="font-poppins font-bold text-3xl">What is this artwork?</h2>

      <div className="artwork-info">
        <h3>Here is title. Here is title.</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. ( get from
          profile)
        </p>
        <div className="artwork-tags">
          <h3>mood:</h3>
          <div className="tag-list">
            <p>Night</p>
            <p>morning</p>
          </div>
        </div>

        <div className="style-year-created">
          <h3>Style:</h3>
          <p>Oil painting</p>
        </div>

        <div className="style-year-created">
          <h3>Year Created:</h3>
          <p>16/10/2025</p>
        </div>
      </div>
    </>
  );
}
