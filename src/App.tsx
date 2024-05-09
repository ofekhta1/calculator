import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Quest from './components/content'; // Ensure this component is correctly imported
import NavBar from './components/NavBar'; // Ensure this component is correctly imported
import SiteHeading from './components/SIteHeading'; // Check for correct file name and spelling

type FirstDateData = {
  firstdate: Date;
  lastdate: Date;
  investpermonth: number;
  profit: number;
  profitpercent: number;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: FirstDateData) => {
    console.log('Form Data:', data);
    setIsLoading(true);
    try {
      const formattedData = {
        firstdate: data.firstdate.toISOString().slice(0, 10), // Ensure date is in the correct format
        lastdate: data.lastdate.toISOString().slice(0, 10),
        investpermonth: data.investpermonth
      };
      const response = await axios.post('http://localhost:5000/query', formattedData);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);  // Ensure isLoading is set to false after processing
    }
  };

  return (
    <div className="mb-5">
      <NavBar />
      <SiteHeading />
      <Quest onSubmit={handleFormSubmit} />
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default App;
