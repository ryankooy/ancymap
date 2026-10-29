import React, { useEffect, useState, FC } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AddPersonForm from './AddPersonForm';
import Grid from './Grid';
import BackendService from './services/BackendService';
import { Data, Person, Region } from './models/Data';

const Form: FC = () => {
  const [personList, setPersonList] = useState<Person[]>([]);
  const [regionList, setRegionList] = useState<Region[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setError(null);
    try {
      const data: Data = await BackendService.getData();
      if (data) {
        setPersonList(data.people);
        setRegionList(data.regions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch people data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', display: 'grid', placeItems: 'center' }}>
      <IconButton onClick={() => window.history.back()} aria-label="back">
        <ArrowBackIcon />
      </IconButton>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <Grid people={personList} regions={regionList} refetch={fetchData} />

      <AddPersonForm refetch={fetchData} />
    </div>
  );
};

export default Form;
