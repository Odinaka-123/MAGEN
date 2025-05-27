import React, { useState } from 'react';
import { searchBreachesByEmail } from '../services/api';

const BreachSearchForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(''); // Replace with your actual user ID source if needed
  const [breaches, setBreaches] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false); // New state flag

  const handleSearch = async () => {
    try {
      const data = await searchBreachesByEmail(userId, email);
      setBreaches(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch breaches.');
      setBreaches([]);
    }
    setSearched(true); // Mark that a search has been performed
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {searched && (breaches.length > 0 ? (
        <ul>
          {breaches.map((breach) => (
            <li key={breach.id}>{breach.description}</li>
          ))}
        </ul>
      ) : (
        <p>No breaches found.</p>
      ))}
    </div>
  );
};

export default BreachSearchForm;
