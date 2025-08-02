import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/Button';
import TextInput from '../components/TextInput';

export default function RegisterEventPage() {
  const { eventId } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');
  const [myEmail, setMyEmail] = useState('');
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [findMsg, setFindMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setRegisterMsg('');
    if (!name || !email) {
      setRegisterMsg('Please enter your name and email.');
      return;
    }
    setLoading(true);
    try {
      // First, try to get userId by email
      let userId = null;
      const usersRes = await axios.get(`${API_BASE_URL}/api/users`);
      const user = usersRes.data.find((u: any) => u.email === email);
      if (user) {
        userId = user.id;
      } else {
        // Create user if not exists
        const createRes = await axios.post(`${API_BASE_URL}/api/users`, { name, email });
        userId = createRes.data.id;
      }
      // Now register using userId
      const res = await axios.post(`${API_BASE_URL}/api/events/register`, { eventId, userId });
      setRegisterMsg(res.data.message || 'Registered successfully!');
    } catch (err: any) {
      setRegisterMsg(err.response?.data?.message || 'Registration failed.');
    }
    setLoading(false);
  };

  const handleFindEvents = async (e: any) => {
    e.preventDefault();
    setFindMsg('');
    setMyEvents([]);
    if (!myEmail) {
      setFindMsg('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      // Get all users, find userId by email
      const usersRes = await axios.get(`${API_BASE_URL}/api/users`);
      const user = usersRes.data.find((u: any) => u.email === myEmail);
      if (!user) {
        setFindMsg('No registered events found.');
        setLoading(false);
        return;
      }
      const userId = user.id;
      // Get all events, filter those where user is registered
      const eventsRes = await axios.get(`${API_BASE_URL}/api/events`);
      const events = eventsRes.data.filter((ev: any) =>
        ev.registrations?.some((reg: any) => reg.user_id === userId)
      );
      setMyEvents(events);
      if (events.length === 0) setFindMsg('No registered events found.');
    } catch (err: any) {
      setFindMsg(err.response?.data?.message || 'Failed to fetch events.');
    }
    setLoading(false);
  };

  const handleCancel = async (eventId: string) => {
    setLoading(true);
    try {
      // Get userId by email
      let userId = null;
      const usersRes = await axios.get(`${API_BASE_URL}/api/users`);
      const user = usersRes.data.find((u: any) => u.email === myEmail);
      if (!user) throw new Error('User not found');
      userId = user.id;
      await axios.post(`${API_BASE_URL}/api/events/cancel`, { eventId, userId });
      setMyEvents(myEvents.filter(ev => ev.id !== eventId));
      setFindMsg('Registration cancelled.');
    } catch (err: any) {
      setFindMsg(err.response?.data?.message || 'Failed to cancel registration.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white text-sm">
      <h2 className="text-lg font-bold mb-4 text-[#333]">Register for Event</h2>
      <form onSubmit={handleRegister} className="bg-[#BCD1D2] rounded p-6 mb-6 w-full max-w-md flex flex-col gap-3">
        <TextInput value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full" />
        <TextInput value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full" />
        <Button type="submit" className="w-full bg-[#55605B] text-white">Register</Button>
        {registerMsg && <div className="text-center text-red-600 mt-2">{registerMsg}</div>}
      </form>
      <div className="w-full max-w-md bg-[#BCD1D2] rounded p-6">
        <h3 className="text-base font-bold mb-2 text-[#333]">My Registered Events</h3>
        <form onSubmit={handleFindEvents} className="flex gap-2 mb-4">
          <TextInput value={myEmail} onChange={e => setMyEmail(e.target.value)} placeholder="Enter your email" type="email" className="w-full" />
          <Button type="submit" className="bg-[#55605B] text-white">Find My Events</Button>
        </form>
        {findMsg && <div className="text-center text-red-600 mb-2">{findMsg}</div>}
        <ul>
          {myEvents.map(ev => (
            <li key={ev.id} className="mb-2 flex justify-between items-center bg-[#EAEDF1] rounded p-2">
              <span>{ev.title} ({new Date(ev.event_time).toLocaleString()})</span>
              <Button onClick={() => handleCancel(ev.id)} className="bg-red-600 text-white">Cancel Registration</Button>
            </li>
          ))}
        </ul>
      </div>
      {loading && <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"><div className="bg-white p-4 rounded shadow">Loading...</div></div>}
    </div>
  );
}
