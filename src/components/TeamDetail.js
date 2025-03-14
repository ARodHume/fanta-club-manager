
        import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const db = getFirestore();
      const teamRef = doc(db, 'teams', id);
      const teamSnap = await getDoc(teamRef);
      
      if (teamSnap.exists()) {
        setTeam({ id: teamSnap.id, ...teamSnap.data() });
      }
      setLoading(false);
    };

    fetchTeam();
  }, [id]);

  if (loading) {
    return <div className="loading">Caricamento dettagli squadra...</div>;
  }

  if (!team) {
    return <div className="error">Squadra non trovata!</div>;
  }

  return (
    <div className="team-detail">
      <h2 className="retro-text">{team.name}</h2>
      
      <div className="card financial-card">
        <h3>Situazione Finanziaria</h3>
        <p>Budget Iniziale: {team.initialBudget} crediti</p>
        <p>Budget Attuale: {team.currentBudget} crediti</p>
      </div>
      
      <div className="card stadium-card">
        <h3>Stadio</h3>
        {team.stadium ? (
          <>
            <p>Nome: {team.stadium.name}</p>
            <p>Ricavo Base: {team.stadium.baseRevenue} crediti</p>
            <p>Bonus Vittoria: {team.stadium.winBonus} crediti</p>
            <Link to={`/stadium/${id}`} className="button">
              Gestisci Stadio
            </Link>
          </>
        ) : (
          <p>Nessuno stadio assegnato</p>
        )}
      </div>
      
      <div className="card players-card">
        <h3>Rosa Giocatori</h3>
        {team.players && team.players.length > 0 ? (
          <div className="players-list">
            {team.players.map(player => (
              <div key={player.id} className="player-item">
                <p>{player.name} - {player.role} - {player.team}</p>
                <p>Valore: {player.value} - Ingaggio: {player.wage}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Nessun giocatore nella rosa</p>
        )}
      </div>
      
      <div className="actions">
        <Link to="/" className="button">Torna alla Dashboard</Link>
      </div>
    </div>
  );
}

export default TeamDetail;
