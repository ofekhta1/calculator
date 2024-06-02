import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const API_ENDPOINT = 'http://localhost:5000/query'; // Replace with your actual API endpoint

interface FormData {
  investpermonth: string;
  profit: string;
  profitpercent: string;
}

const MyFormComponent: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [selectedFirstDate, setSelectedFirstDate] = useState<Date | null>(null);
  const [selectedLastDate, setSelectedLastDate] = useState<Date | null>(null);
  const [serverResponse, setServerResponse] = useState('');

  const submitForm = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('investpermonth', data.investpermonth);
      formData.append('profit', data.profit);
      formData.append('profitpercent', data.profitpercent);

      if (selectedFirstDate) {
        formData.append('firstDate', selectedFirstDate.toISOString());
      }
      if (selectedLastDate) {
        formData.append('lastDate', selectedLastDate.toISOString());
      }

      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Content-Type': 'application/json',
        },
      });

      setServerResponse(response.data.answer);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="form-wrapper">
      <div className="form-container">
        <label className="form-label" htmlFor="firstDatePicker">Choose a first date:</label>
        <DatePicker
          selected={selectedFirstDate}
          onChange={(date: Date | null) => setSelectedFirstDate(date)}
          id="firstDatePicker"
          className="datepicker"
        />

        <label className="form-label" htmlFor="lastDatePicker">Choose a last date:</label>
        <DatePicker
          selected={selectedLastDate}
          onChange={(date: Date | null) => setSelectedLastDate(date)}
          id="lastDatePicker"
          className="datepicker"
        />

        <label htmlFor="investpermonth" className="form-label">Invest per month:</label>
        <input {...register('investpermonth')} id="investpermonth" defaultValue={1000} type="text" className="form-control" />

        <label htmlFor="profit" className="form-label">Profit:</label>
        <input {...register('profit')} id="profit" type="text" className="form-control" />

        <label htmlFor="profitpercent" className="form-label">Profit percent:</label>
        <input {...register('profitpercent')} id="profitpercent" type="text" className="form-control" />

        <button type="submit" className="btn-primary">Submit</button>
      </div>
      {serverResponse && <div className="mt-3"><strong>Server Response:</strong><p>{serverResponse}</p></div>}
    </form>
  );
};

export default MyFormComponent;


