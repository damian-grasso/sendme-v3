export interface AvailabilityBlock {
    day: string;
    startTime: string;
    endTime: string;
    response: "Yes" | "Maybe" | "No";
    note: string;
}