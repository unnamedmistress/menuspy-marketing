import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="bg-purple-900 p-4">
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="text-pink-300 hover:text-pink-100 transition-colors">Home</Link>
        </li>
        <li>
          <Link to="/labyrinth" className="text-pink-300 hover:text-pink-100 transition-colors">Labyrinth</Link>
        </li>
        <li>
          <Link to="/codex" className="text-pink-300 hover:text-pink-100 transition-colors">Celestial Codex</Link>
        </li>
        <li>
          <Link to="/progressorium" className="text-pink-300 hover:text-pink-100 transition-colors">Progressorium</Link>
        </li>
        <li>
          <Link to="/wheel" className="text-pink-300 hover:text-pink-100 transition-colors">Wheel of Misfortune</Link>
        </li>
      </ul>
    </nav>
  );
}