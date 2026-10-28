import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import BackendService from './services/BackendService';
import { Data, Person, ResultsData } from './models/Data';

let DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  //iconSize:,
  //iconAnchor:,
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function normalizeToPercentage(value: number, min = 1, max = 100): number {
  // Clamp value between min and max
  const clamped = Math.max(min, Math.min(max, value));

  // Normalize the value to a percentage (0 to 1)
  const percentage = (clamped - min) / (max - min);

  return percentage;
}

function getColorFromSpectrum(percentage: number, min = 1, max = 100): string {
  // Map percentage to a hue range (0 = red/low, 120 = green/high, or up to 360)
  // Example: Red (0) -> Yellow (60) -> Green (120)
  const hue = percentage * 120;

  // Saturation and Lightness stay fixed for vibrant colors
  const saturation = 100; // percentage
  const lightness = 50;  // percentage

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Function to generate a dynamic SVG pin icon
const createCustomMarker = (opacity: number) => {
  const color: string = getColorFromSpectrum(opacity);
  //const color: string = 'orange';

  return L.divIcon({
    className: 'custom-icon', // Removes default background styles
    html: `
      <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://w3.org">
        <path d="M15 0C6.71 0 0 6.71 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71 23.29 0 15 0ZM15 20.5C11.96 20.5 9.5 18.04 9.5 15C9.5 11.96 11.96 9.5 15 9.5C18.04 9.5 20.5 11.96 20.5 15C20.5 18.04 18.04 20.5 15 20.5Z"
              fill="${color}" fill-opacity="${opacity}"/>
      </svg>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42], // Tip of the pin
    popupAnchor: [0, -40],
  });
};

const Map: React.FC = () => {
  const europeCenter: [number, number] = [54.84583, 25.30639];
  const [data, setData] = useState<Data | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [regionData, setResultsData] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<Person[]>([]);

  const navigate = useNavigate();

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersonId(event.target.value); // event.target.value yields the selected <option value="...">
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const data: Data = await BackendService.getData();
        setData(data);
        setDropdownOptions(data.people);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch people data');
      }
    };
    fetchData();

    if (!selectedPersonId) {
      setResultsData(null);
      return;
    }

    const fetchResultsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data: ResultsData = await BackendService.getResultsData(selectedPersonId);
        setResultsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch region data');
        setResultsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultsData();
  }, [selectedPersonId]);

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        className="btn"
        onClick={() => navigate('/form')}
        style={{ marginBottom: '20px' }}
      >
        Update Records
      </button>

      <label htmlFor="item-select" style={{ display: 'block', marginBottom: '8px' }}>
        Select a person to view their ancestry results:
      </label>

      <select
        id="item-select"
        value={selectedPersonId}
        onChange={handleDropdownChange}
        style={{ padding: '8px', width: '200px', marginBottom: '20px' }}
      >
        <option value="">-- Choose a person --</option>
        {dropdownOptions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: '10px' }}>
        {isLoading && <p>Loading data for ID {selectedPersonId}...</p>}

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {regionData && !isLoading && (
          <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Render map */}
            <MapContainer center={europeCenter} zoom={4} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {regionData.regions.map((region) => (
                <Marker key={region.region} position={region.location} icon={createCustomMarker(region.percentage_scaled)}>
                  <Popup>
                    <p>{region.percentage}%</p>
                    <p>{region.region} ({region.macro_region})</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
