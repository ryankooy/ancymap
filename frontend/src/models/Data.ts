export interface Result {
    region: string;
    macro_region: string;
    percentage: number;
    percentage_scaled: number;
    location: [number, number];
}

export interface ResultsData {
    person: string;
    regions: Result[];
}

export interface Person {
    id: string;
    name: string;
}

export interface Region {
    id: string;
    name: string;
}

export interface Data {
    people: Person[];
    regions: Region[];
}

