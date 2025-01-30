import React, { useState, useEffect } from "react";

const GLiNetDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [routerData, setRouterData] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const loginToRouter = async () => {
    try {
      const response = await fetch('http://192.168.8.1/cgi-bin/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'jarabacoa809', // Enter your router password here
        }),
        mode: 'no-cors', 
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      setToken(data.token);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Failed to authenticate');
    }
  };

  const fetchRouterData = async () => {
    try {
      const response = await fetch('http://192.168.8.1/cgi-bin/api/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch router data');
      
      const data = await response.json();
      setRouterData(data);
    } catch (error) {
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRouterData();
    }
  }, [isAuthenticated]);

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">GL.iNet Router Dashboard</h2>
      {!isAuthenticated ? (
        <button
          onClick={loginToRouter}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login to Router
        </button>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : routerData ? (
        <div>
          <h3 className="text-lg font-bold">Router Status</h3>
          <p>Connected Devices: {routerData.connectedDevices}</p>
          <p>Download Speed: {routerData.downloadSpeed} Mbps</p>
          <p>Upload Speed: {routerData.uploadSpeed} Mbps</p>
        </div>
      ) : (
        <p>Loading router data...</p>
      )}
    </div>
  );
};

export default GLiNetDashboard;
