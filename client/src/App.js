import { useState, useEffect } from 'react';
import { accessToken, logout, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';
import {BrowserRouter as Router,
        Routes,
        useLocation,
        Route
      } from "react-router-dom";
import { GlobalStyle } from './styles';
import styled from 'styled-components/macro';
import { Login } from "./pages";


const StyledLoginButton = styled.a`
  background-color: var(--green);
  color: var(--white);
  padding: 10px 20px;
  margin: 20px;
  border-radius: 30px;
  display: inline-block;
`;


// Returns home page 
function home(profile) {
  return(
    <>
    <button onClick={logout}>Log Out</button>

    {profile && (
      <div>
        <h1>{profile.display_name}</h1>
        <p>{profile.followers.total} Followers</p>
        {profile.images.length && profile.images[0].url && (
          <img src={profile.images[0].url} alt="Avatar"/>
        )}
      </div>
    )}
  </>
  )
};

// Scroll to top of page when changing routes
// https://reactrouter.com/web/guides/scroll-restoration/scroll-to-top
function ScrollToTop() { 
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0,0);
  }, [pathname]);
}


function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      //  Pull in user data
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };
    
    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <Router>
            <ScrollToTop />
            <Routes>

              <Route path="/top-artists" element={<h1>Top Artist</h1>}></Route>

              <Route path="/top-tracks" element={<h1>Top Tracks</h1>}></Route>

              <Route path="/playlists/:id" element={<h1>Playlist</h1>}></Route>

              <Route path="/playlists/" element={<h1>Playlist</h1>}></Route>

              <Route path="/" element={home(profile)}>

              </Route>
            </Routes>

            
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;