import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import {
    ClientSideRowModelModule, ColDef, ModuleRegistry
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import CheckIcon from '@mui/icons-material/Check';

import BackendService from './services/BackendService';
import { FormSubmitResult, Person, Region } from './models/Data';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface RowData extends Person {
  hasResults: boolean;
  refetch: () => void;
}

const ActionCellRenderer: React.FC<CustomCellRendererProps<RowData>> = (params) => {
  // Guard against missing row data
  if (!params.data) return null;

  const handleEdit = () => {
    alert(`Editing item: ${params.data?.name} (ID: ${params.data?.id})`);
  };

  const handleDelete = async () => {
    const personId = params.data?.id;

    if (!personId) return;

    try {
      const result: FormSubmitResult = await BackendService.removePerson(personId);

      if (result && result.success) {
        params.data?.refetch();
      } else {
        alert('Person not found');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove person');
    }

  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '100%' }}>
      <button
        onClick={handleEdit}
        style={{ padding: '4px 8px', cursor: 'pointer' }}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        style={{ padding: '4px 8px', color: 'red', cursor: 'pointer' }}
      >
        Remove
      </button>
    </div>
  );
};

interface HasResultsProps {
  hasResults: boolean;
}

const ConditionalCheckmark: React.FC<CustomCellRendererProps<HasResultsProps>> = (params) => {
  return (
    <span>
      {params.data?.hasResults && <CheckIcon />}
    </span>
  );
};

interface BulkDataProps {
  people: Person[];
  regions: Region[];
  refetch: () => void;
}

export const Grid: React.FC<BulkDataProps> = ({ people, regions, refetch }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Row Data State
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    setRowData(people.map((person) => ({
      ...person,
      hasResults: false,
      refetch,
    })));
  }, [people]);

//    { id: '32f0i32fo3', name: "Bill", hasResults: false },
//    { id: '9329kd92k3', name: "Bo", hasResults: true },
//    { id: 'dd02k33924', name: "Baggins", hasResults: false },

  // Column Definitions typed explicitly with ColDef
  const [columnDefs] = useState<ColDef<RowData>[]>([
    { field: 'name', headerName: 'Person' },
    { field: 'hasResults', headerName: 'Has Results', cellRenderer: ConditionalCheckmark }, //valueFormatter: b => `$${ConditionalCheckmark(b.value)}` },
    //{ field: 'id', headerName: 'ID', width: 70 },
    {
      headerName: 'Actions',
      field: 'id', // Assigning a field helps grid change detection, or leave empty
      cellRenderer: ActionCellRenderer,
      minWidth: 150,
      sortable: false,
      filter: false,
    }
  ]);

  // Default Column settings applied to all except custom actions override
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { textAlign: 'left' },
  }), []);

  return (
    /* Apply an AG Grid theme class name and sizing container */
    <div className="ag-theme-alpine" style={{ marginTop: '15px', display: 'inline-block', width: '700px' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        autoSizeStrategy={{
          type: 'fitGridWidth',
          defaultMinWidth: 50
        }}
      />
      {success && <p style={{ color: 'green' }}>Record removed</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default Grid;
