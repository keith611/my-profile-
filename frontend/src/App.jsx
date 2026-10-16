import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext.jsx';
import { IntroPage } from './pages/IntroPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { ReviewPage } from './pages/ReviewPage.jsx';
import { SurveyPage } from './pages/SurveyPage.jsx';
import { ThankYouPage } from './pages/ThankYouPage.jsx';
import { TradingBotPage } from './pages/TradingBotPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';

export default function App() {
  return (
    <SurveyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TradingBotPage />} />
          <Route path="/trading-bot" element={<TradingBotPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/networking" element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SurveyProvider>
  );
}
