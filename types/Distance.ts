export class Distance {
  private meters: number;

  constructor(meters: number) {
    this.meters = meters;
  }

  static fromKilometers(km: number) {
    return new Distance(km * 1000);
  }

  static fromNauticalMiles(nm: number) {
    return new Distance(nm * 1852);
  }

  static fromMeters(m: number) {
    return new Distance(m);
  }

  toKilometers(): number {
    return this.meters / 1000;
  }

  toNauticalMiles(): number {
    return this.meters / 1852;
  }

  toMeters(): number {
    return this.meters;
  }

  toString(unit: "km" | "nm" | "m" = "km", decimals = 2): string {
    switch (unit) {
      case "km":
        return `${this.toKilometers().toFixed(decimals)} km`;
      case "nm":
        return `${this.toNauticalMiles().toFixed(decimals)} NM`;
      case "m":
        return `${this.toMeters().toFixed(0)} m`;
      default:
        return `${this.toKilometers().toFixed(decimals)} km`;
    }
  }
}