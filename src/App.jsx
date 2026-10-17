import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { emmanuelProfile } from './data/emmanuelProfile.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/emmanuel" element={<ProfilePage key={emmanuelProfile.publicPath} profileData={emmanuelProfile} />} />
        <Route path="*" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
