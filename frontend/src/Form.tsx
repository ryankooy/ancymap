import React, { useState, useEffect, ChangeEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import BackendService from './services/BackendService';
import { Data, FormSubmitResult, Person, ResultsData } from './models/Data';

interface PersonFormData {
  name: string;
}

const Form: React.FC = () => {
  const [personFormData, setPersonFormData] = useState<PersonFormData>({ name: '' });
  //const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  //const [regionData, setResultsData] = useState<ResultsData | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  //const [dropdownOptions, setDropdownOptions] = useState<Person[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page reload

    let personName: string = personFormData.name;
    if (!personName) return;

    // Capitalize the name
    personName = personName.charAt(0).toUpperCase() + personName.slice(1);

    setSuccess(false);
    setError(null);

    try {
      const result: FormSubmitResult = await BackendService.addPerson(personName);

      if (!!result && result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError('Person already exists');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add person');
    }

    // Reset form fields
    setPersonFormData({ name: '' });
  };

  return (
    <div style={{ padding: '20px', display: 'grid', placeItems: 'center' }}>
      <IconButton onClick={() => window.history.back()} aria-label="back">
        <ArrowBackIcon />
      </IconButton>

      <h2>Add Person</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '500px' }}>
        <div>
          <label htmlFor="personName" style={{ display: 'block', marginBottom: '5px' }}>
            Person name:
          </label>
          <input
            type="text"
            id="personName"
            name="name"
            value={personFormData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: '25%',
            padding: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add
        </button>
      </form>
      {success && <p style={{ color: 'green' }}>Record(s) added</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default Form;
