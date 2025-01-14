export type Room = {
    id: number;
    name: string;
    floor: number;
    status: 'clean' | 'dirty' | 'in_progress';
    lastCleaned: string;
    assignedCleaners: number[];
    images: string[];
}; 