import React, { useEffect, useState } from "react";
import { fetchApplications, Application } from "../hooks/useKeihi";

export const ApplicationsPage: React.FC = () => {
  const [Applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (err) {
        setError("Failed to fetch spend requests");
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Spend Requests</h1>
      <ul>
        {Applications.map((request) => (
          <li key={request.id}>
            {request.spend_to} - {request.amount}円
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationsPage;
