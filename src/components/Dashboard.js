
        import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const db = getFirestore();
      const teamsCollection = collection(db, 'teams');
      const teamsSnapshot = await getDocs(teamsCollection);
      const teamsList = teamsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(teamsList);
      setLoading(false);
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <div className="loading">Caricamento squadre...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="retro-text">Squadre</h2>
      
      {teams.length === 0 ? (
        <p>Nessuna squadra trovata. Aggiungi la tua prima squadra!</p>
      ) : (
        <div className="teams-grid">
          {teams.map(team => (
            <div key={team.id} className="card team-card">
              <h3>{team.name}</h3>
              <p>Budget: {team.currentBudget} crediti</p>
              <p>Stadio: {team.stadium ? team.stadium.name : 'Nessuno'}</p>
              <p>Giocatori: {team.players ? team.players.length : 0}</p>
              <Link to={`/team/${team.id}`} className="button">
                Visualizza Dettagli
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <div className="actions">
        <button className="add-button">+ Aggiungi Squadra</button>
      </div>
    </div>
  );
}

export default Dashboard;
