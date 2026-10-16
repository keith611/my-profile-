import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProfilePage } from './pages/ProfilePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
