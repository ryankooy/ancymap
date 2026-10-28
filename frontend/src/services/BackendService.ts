import { Data, FormSubmitResult, ResultsData } from '../models/Data';

class BackendService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async getData(): Promise<Data> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: Data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch people data');
    }
  }

  public async getResultsData(personId: string): Promise<ResultsData> {
    const params = new URLSearchParams({ personId });
    try {
      const response = await fetch(`${this.baseUrl}/data?${params}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ResultsData = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch regions data');
    }
  }

  public async addPerson(personName: string): Promise<FormSubmitResult> {
    try {
      const response = await fetch(`${this.baseUrl}/data/person`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: personName })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: FormSubmitResult = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to add person');
    }
  }

  public async removePerson(personId: string): Promise<FormSubmitResult> {
    try {
      const response = await fetch(`${this.baseUrl}/data/person/${personId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: FormSubmitResult = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to remove person');
    }
  }

  public async addResults(personId: string, year: number, regionPercentages: object): Promise<object> {
    try {
      const response = await fetch(`${this.baseUrl}/data/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          person_id: personId,
          year,
          region_percentages: regionPercentages
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ResultsData = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to add person');
    }
  }
}

export default new BackendService('http://localhost:8000');
