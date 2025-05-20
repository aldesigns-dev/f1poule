export interface DriverResult {
  position: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
}