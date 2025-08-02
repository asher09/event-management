import { useState } from 'react';
import axios from 'axios';
import TextInput from '../components/TextInput';
import NumberInput from '../components/NumberInput';
import { Button } from '../components/Button';

export default function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [eventTime, setEventTime] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async () => {
    setMessage('');
    try {
      await axios.post('/api/events', { title, event_time: eventTime, location, capacity }, {
        headers: { 'Content-Type': 'application/json'}
      });
      setMessage('Created!');
      setTitle('');
      setLocation('');
      setCapacity(1);
      setEventTime('');
    } catch {
      setMessage('Error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]" style={{ background: '#EAEDF1' }}>
      <TextInput 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        placeholder="Title" 
        className="mb-2 w-64 border border-[#BCD1D2] bg-[#EAEDF1] text-[#55605B] placeholder-[#A2A7A7]"
      />
      <TextInput 
        value={location} 
        onChange={e => setLocation(e.target.value)} 
        placeholder="Location" 
        className="mb-2 w-64 border border-[#BCD1D2] bg-[#EAEDF1] text-[#55605B] placeholder-[#A2A7A7]"
      />
      <NumberInput 
        value={capacity} 
        onChange={e => setCapacity(Number(e.target.value))} 
        min={1} 
        max={1000}
        className="mb-4 w-64 border border-[#BCD1D2] bg-[#EAEDF1] text-[#55605B] placeholder-[#A2A7A7]"
      />
      <TextInput 
        type="datetime-local"
        value={eventTime}
        onChange={e => setEventTime(e.target.value)}
        placeholder="Event Time"
        className="mb-2 w-64 border border-[#BCD1D2] bg-[#EAEDF1] text-[#55605B] placeholder-[#A2A7A7]"
      />
      <Button 
        onClick={handleCreate}
        className="w-32 bg-[#55605B] text-[#EAEDF1] hover:bg-[#15181C]"
      >
        Create
      </Button>
      {message && <div className="mt-2 text-green-600">{message}</div>}
    </div>
  );
}
