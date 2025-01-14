export type Room = {
    id: number;
    property_id: number;
    property_name: string;
    room_number: string;
    vacancy_date: string;
    cleaning_deadline: string;
    status: 'normal' | 'urgent' | 'overdue';
}; 