import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEventPage from './pages/CreateEventPage';
import EventsDashboardPage from './pages/EventsDashboardPage';
import RegisterEventPage from './pages/RegisterEventPage';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#f7f5f4' }}>
        <Routes>
          <Route path="/" element={<EventsDashboardPage />} />
          <Route path="/create" element={<CreateEventPage />} />
          <Route path="/register/:eventId" element={<RegisterEventPage />} />
        </Routes>
      </div>
    </Router>
  );
}
