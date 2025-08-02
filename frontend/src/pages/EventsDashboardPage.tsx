import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function EventsDashboardPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/events`)
      .then(res => {
        // Defensive: always set to array
        setEvents(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setEvents([]); // fallback to empty array
        setError('Error fetching events');
        setLoading(false);
      });
  }, []);

  const openDetails = (eventId: string) => {
    setDetailsLoading(true);
    setSelectedEvent(null);
    axios.get(`${API_BASE_URL}/api/events/${eventId}`)
      .then(res => {
        setSelectedEvent(res.data);
        setDetailsLoading(false);
      })
      .catch(() => {
        setSelectedEvent(null);
        setError('Error fetching event details');
        setDetailsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white text-sm">
      <h2 className="text-lg font-bold mb-4 text-[#55605B]">Events Dashboard</h2>
      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : error ? (
        <div className="text-center mt-10 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto w-full max-w-3xl mb-8">
          <table className="min-w-full bg-[#fff] rounded-2xl border-separate border-spacing-y-1.5 shadow-lg">
            <thead>
              <tr className="bg-black text-[#fff] rounded-3xl">
                <th className="py-2 px-2 rounded-l-xl">Title</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Location</th>
                <th className="py-2 px-2">Capacity</th>
                <th className="py-2 px-2">Registrations</th>
                <th className="py-2 px-2 rounded-r-xl">Register</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="bg-[#f0f0f0] text-[#333] border rounded-2xl">
                  <td className="py-2.5 px-2 font-bold cursor-pointer hover:bg-[#F3F4F6] rounded-l-xl" onClick={() => openDetails(event.id)}>{event.title}</td>
                  <td className="py-2.5 px-2 cursor-pointer hover:bg-[#F3F4F6]" onClick={() => openDetails(event.id)}>{new Date(event.event_time).toLocaleString()}</td>
                  <td className="py-2.5 px-2 cursor-pointer hover:bg-[#F3F4F6]" onClick={() => openDetails(event.id)}>{event.location}</td>
                  <td className="py-2.5 px-2">{event.capacity}</td>
                  <td className="py-2.5 px-2">{event.registrations?.length ?? 0}</td>
                  <td className="py-2.5 px-2 rounded-r-xl">
                    <Button onClick={() => navigate(`/register/${event.id}`)} className="px-7 py-1 cursor-pointer bg-gray-700 hover:bg-black text-white rounded-xl">Register</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Event Details Modal/Section */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <Button onClick={() => setSelectedEvent(null)} className="absolute top-2 right-2 bg-gray-700 text-white">Close</Button>
            <h3 className="text-base font-bold mb-2 text-[#333]">{selectedEvent.title}</h3>
            <div className="mb-1 text-[#333]">Date & Time: {new Date(selectedEvent.event_time).toLocaleString()}</div>
            <div className="mb-1 text-[#333]">Location: {selectedEvent.location}</div>
            <div className="mb-2 text-[#333]">Capacity: {selectedEvent.capacity}</div>
            <div className="mb-2 text-[#333]">Total Registrations: {selectedEvent.stats?.totalRegistrations ?? selectedEvent.registrations?.length ?? 0}</div>
            <div className="mb-2 text-[#333]">Remaining Capacity: {selectedEvent.stats?.remainingCapacity ?? (selectedEvent.capacity - (selectedEvent.registrations?.length ?? 0))}</div>
            <div className="mb-2 text-[#333]">Percentage Used: {selectedEvent.stats?.percentageUsed ?? Math.round(((selectedEvent.registrations?.length ?? 0) / selectedEvent.capacity) * 100)}%</div>
            <div className="mb-2 text-[#333] font-bold">Registered Users:</div>
            <ul className="mb-2">
              {selectedEvent.registrations?.length > 0 ? (
                selectedEvent.registrations.map((reg: any) => (
                  <li key={reg.user.id} className="text-[#333]">{reg.user.name} ({reg.user.email})</li>
                ))
              ) : (
                <li className="text-[#333]">No registrations yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      {detailsLoading && <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"><div className="bg-white p-4 rounded shadow">Loading details...</div></div>}
    </div>
  );
}
