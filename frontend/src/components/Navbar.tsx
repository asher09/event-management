import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="w-full py-4 mb-8" style={{ background: '#000' }}>
    <div className="flex justify-center gap-6">
      <Link to="/" className="text-white font-semibold">Events</Link>
      <Link to="/create" className="text-white font-semibold">Create</Link>
    </div>
  </nav>
);

export default Navbar;
