import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { getRoomDetails, getRoomCleaningHistory } from '../../api/wordpress';
import type { Room, CleaningHistory } from '../../types';

export const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [history, setHistory] = useState<CleaningHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const [roomData, historyData] = await Promise.all([
          getRoomDetails(roomId),
          getRoomCleaningHistory(roomId)
        ]);
        setRoom(roomData);
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to fetch room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  if (loading) return <div>Loading...</div>;
  if (!room) return <div>Room not found</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{room.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Floor:</p>
            <p>{room.floor}</p>
          </div>
          <div>
            <p className="font-semibold">Status:</p>
            <p>{room.status}</p>
          </div>
          <div>
            <p className="font-semibold">Last Cleaned:</p>
            <p>{room.lastCleaned}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Cleaning History</h2>
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="border-b pb-4">
              <p className="font-semibold">{entry.date}</p>
              <p>{entry.cleanedBy}</p>
              <p>{entry.notes}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/rooms')}
        >
          Back to Rooms
        </Button>
        <Button
          onClick={() => navigate(`/reports/new/${roomId}`)}
        >
          Create Cleaning Report
        </Button>
      </div>
    </div>
  );
};

export default RoomDetailPage;