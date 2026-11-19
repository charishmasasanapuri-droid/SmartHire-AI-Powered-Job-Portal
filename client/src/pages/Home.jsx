import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h1>Welcome to SmartHire</h1>
        <p>Find your dream job or hire the best candidates.</p>
      </div>
    </>
  );
}

export default Home;