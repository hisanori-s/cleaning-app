import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SuccessMessage } from '../../components/reports/complete/success-message';

export default function ReportCompletePage() {
  const navigate = useNavigate();

  const handleBackToRooms = () => {
    navigate('/rooms');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SuccessMessage onBackClick={handleBackToRooms} />
    </div>
  );
} 