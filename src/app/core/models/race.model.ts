export interface Race {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  firstPractice: { date: string; time: string };
  secondPractice: { date: string; time: string };
  thirdPractice: { date: string; time: string };
  qualifying: { date: string; time: string };
}