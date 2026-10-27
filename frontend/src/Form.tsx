import React, { useState, useEffect, ChangeEvent } from 'react';

import BackendService from './services/BackendService';
import { Data, Person, ResultsData } from './models/Data';

interface PersonFormData {
  name: string;
}

const Form: React.FC = () => {
  const [personFormData, setPersonFormData] = useState<PersonFormData>({ name: '' });
  //const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  //const [regionData, setResultsData] = useState<ResultsData | null>(null);
  //const [error, setError] = useState<string | null>(null);
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

    if (!personName)
      return;

    // Capitalize the name
    personName = personName.charAt(0).toUpperCase() + personName.slice(1);

    try {
      const data: object = await BackendService.addPerson(personName);
      console.log(data); //todo:remove
    } catch (error) {
      console.error('Failed to add person:', error);
    }

    // Optional: Reset form fields
    setPersonFormData({ name: '' });
  };

//  useEffect(() => {
//    const fetchData = async () => {
//      try {
//        const data: Data = await BackendService.getData();
//        setData(data);
//        setDropdownOptions(data.people);
//      } catch (error) {
//        console.error('Failed to fetch people data:', error);
//      }
//    };
//    fetchData();
//
//    if (!selectedPersonId) {
//      setResultsData(null);
//      return;
//    }
//
//    const fetchResultsData = async () => {
//      setIsLoading(true);
//      setError(null);
//      try {
//        const data: ResultsData = await BackendService.getResultsData(selectedPersonId);
//        console.log(data) //todo:remove
//        setResultsData(data);
//      } catch (error) {
//        setError(error instanceof Error ? error.message : 'Failed to fetch region data');
//        setResultsData(null);
//      } finally {
//        setIsLoading(false);
//      }
//    };
//
//    fetchResultsData();
//  }, [selectedPersonId]);

  return (
    <div style={{ padding: '20px', display: 'grid', placeItems: 'center' }}>
      <h2>Add Person</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '500px' }}>
        <div>
          <label htmlFor="personName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
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
    </div>
  );
};

export default Form;
