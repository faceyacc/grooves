import { useState, useEffect } from 'react';
import { accessToken, logout } from './spotify';
import { catchErrors } from './utils';
import {BrowserRouter as Router,
        Routes,
        useLocation,
        Route
      } from "react-router-dom";
import { GlobalStyle } from './styles';
import styled from 'styled-components/macro';
import { Login, Profile, TopArtists, TopTracks, Playlists, Playlist } from "./pages";


const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

const StyledBackButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: 7% !important;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`


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
  

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <>
            <a href='http://localhost:3000'><StyledBackButton>Generate Playlist</StyledBackButton></a>
            <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/top-artists" element={<h1>TopArtists</h1>}></Route>

                <Route path="/top-tracks" element={<TopTracks />}></Route>

                <Route path="/playlists/:id" element={<Playlist />}></Route>

                <Route path="/playlists/" element={<Playlists />}></Route>

                <Route path="/" element={<Profile />}></Route>
              </Routes> 
            </Router>
          </>
        )}
      </header>
    </div>
  );
}

export default App;