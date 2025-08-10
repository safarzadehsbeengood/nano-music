'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string>('');

  const scanLibrary = async () => {
    setScanning(true);
    setResult('');
    
    try {
      const response = await fetch('/api/songs/scan', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`Success: ${data.message}`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Music Library Admin</h1>
      
      <button
        onClick={scanLibrary}
        disabled={scanning}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {scanning ? 'Scanning...' : 'Scan Music Library'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 text-blackbg-gray-100 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}