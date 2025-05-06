export interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}