import React, { useState, ChangeEvent, FC, FormEvent } from 'react';

import BackendService from './services/BackendService';
import { FormSubmitResult } from './models/Data';

interface PersonFormData {
  name: string;
}

interface PersonProps {
  refetch: () => void;
}

const AddPersonForm: FC<PersonProps> = ({ refetch }) => {
  const [personFormData, setPersonFormData] = useState<PersonFormData>({ name: '' });
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        refetch();
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
          disabled={personFormData.name.trim() === ''}
          className="btn"
          type="submit"
        >
          Add
        </button>
      </form>

      {success && <p style={{ color: 'green' }}>Record added</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default AddPersonForm;
