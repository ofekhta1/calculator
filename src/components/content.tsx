import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_ENDPOINT = 'http://localhost:5000/query';

const schema = z.object({
  firstdate: z.date()
    .min(new Date('1990-01-01'), { message: 'Date must be after January 1, 1990.' }),
  lastdate: z.date()
    .max(new Date(), { message: 'Date cannot be in the future.' }),
  investpermonth: z.number(),
  profit: z.number(),
  profitpercent: z.number()
});

export type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => void;
}

const Quest: React.FC<Props> = ({ onSubmit }) => {
  const [selectedfirstDate, setSelectedfirstDate] = useState<Date | null>(null);
  const [selectedlastdate, setSelectedLastDate] = useState<Date | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const [serverResponse, setServerResponse] = useState<string>('');

  const submitForm = async (data: FormData) => {
    console.log('Submitting:', data); // Log data on submission for debugging
    try {
      const response = await axios.post(API_ENDPOINT, data);
      setServerResponse(response.data.answer);
      reset(); // Optionally reset the form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error); // Log error if submission fails
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="form-wrapper">
      <div className="form-container">
        <label className="form-label" htmlFor="firstDatePicker">Choose a first date:</label>
        <DatePicker
          selected={selectedfirstDate}
          onChange={(date) => setSelectedfirstDate(date)}
          id="firstDatePicker"
          className="datepicker"
        />

        <label className="form-label" htmlFor="lastDatePicker">Choose a last date:</label>
        <DatePicker
          selected={selectedlastdate}
          onChange={(date) => setSelectedLastDate(date)}
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

export default Quest;
