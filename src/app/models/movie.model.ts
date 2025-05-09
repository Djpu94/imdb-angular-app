export interface Movie {
    id: string;
    url: string;
    primaryTitle: string;
    originalTitle: string;
    type: string;
    description: string | null;
    primaryImage: string | null;
    trailer: string | null;
    contentRating: string | null;
    isAdult: boolean;
    releaseDate: Date | null;
    startYear: number | null;
    runtimeMinutes: number | null;
    genres: string[];
    countriesOfOrigin: string[];
    productionCompanies: ProductionCompany[];
    averageRating: number | null;
    numVotes: number | null;
}

export interface ProductionCompany {
    id: string;
    name: string;
}

export interface APIResponse {
    rows: number;
    numFound: number;
    results: Movie[];
    nextCursorMark: string;
}