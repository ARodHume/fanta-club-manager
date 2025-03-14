
        import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

function StadiumManagement() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHome, setIsHome] = useState(true);
  const [isWin, setIsWin] = useState(false);
  const [position, setPosition] = useState(5);
  const [calculatedRevenue, setCalculatedRevenue] = useState(null);

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

  const calculateRevenue = () => {
    if (!team || !team.stadium) return;
    
    let revenue = 0;
    
    // Ricavo base se la partita è in casa
    if (isHome) {
      revenue += team.stadium.baseRevenue;
      
      // Bonus vittoria se vince in casa
      if (isWin) {
        revenue += team.stadium.winBonus;
      }
      
      // Bonus basato sulla posizione in classifica
      if (position <= 3) {
        revenue += team.stadium.top3Bonus;
      } else if (position <= 7) {
        revenue += team.stadium.mid47Bonus;
      } else {
        revenue += team.stadium.bottom3Bonus;
      }
    }
    
    setCalculatedRevenue(revenue);
  };

  const saveRevenue = async () => {
    if (!calculatedRevenue) return;
    
    try {
      const db = getFirestore();
      
      // Aggiorna il budget della squadra
      const teamRef = doc(db, 'teams', id);
      await updateDoc(teamRef, {
        currentBudget: team.currentBudget + calculatedRevenue
      });
      
      // Salva il record dei ricavi
      const revenuesCollection = collection(db, 'stadiumRevenues');
      await addDoc(revenuesCollection, {
        teamId: id,
        isHome,
        isWin,
        position,
        baseRevenue: isHome ? team.stadium.baseRevenue : 0,
        winBonus: isHome && isWin ? team.stadium.winBonus : 0,
        positionBonus: calculatePositionBonus(),
        totalRevenue: calculatedRevenue,
        date: new Date()
      });
      
      // Aggiorna lo stato locale
      setTeam({
        ...team,
        currentBudget: team.currentBudget + calculatedRevenue
      });
      
      alert(`Ricavo di ${calculatedRevenue} crediti aggiunto con successo!`);
      setCalculatedRevenue(null);
    } catch (error) {
      console.error("Errore nel salvataggio dei ricavi:", error);
      alert("Errore nel salvataggio dei ricavi: " + error.message);
    }
  };

  const calculatePositionBonus = () => {
    if (!isHome) return 0;
    
    if (position <= 3) {
      return team.stadium.top3Bonus;
    } else if (position <= 7) {
      return team.stadium.mid47Bonus;
    } else {
      return team.stadium.bottom3Bonus;
    }
  };

  if (loading) {
    return <div className="loading">Caricamento gestione stadio...</div>;
  }

  if (!team) {
    return <div className="error">Squadra non trovata!</div>;
  }

  if (!team.stadium) {
    return <div className="error">Nessuno stadio assegnato a questa squadra!</div>;
  }

  return (
    <div className="stadium-management">
      <h2 className="retro-text">Gestione Stadio: {team.stadium.name}</h2>
      
      <div className="card stadium-info">
        <h3>Informazioni Stadio</h3>
        <p>Ricavo Base: {team.stadium.baseRevenue} crediti</p>
        <p>Bonus Vittoria: {team.stadium.winBonus} crediti</p>
        <p>Bonus Prime 3: {team.stadium.top3Bonus} crediti</p>
        <p>Bonus 4-7: {team.stadium.mid47Bonus} crediti</p>
        <p>Bonus Ultime 3: {team.stadium.bottom3Bonus} crediti</p>
      </div>
      
      <div className="card revenue-calculator">
        <h3>Calcola Ricavi</h3>
        <div className="form-group">
          <label>
            Partita in casa?
            <input
              type="checkbox"
              checked={isHome}
              onChange={(e) => setIsHome(e.target.checked)}
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Vittoria?
            <input
              type="checkbox"
              checked={isWin}
              onChange={(e) => setIsWin(e.target.checked)}
              disabled={!isHome}
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Posizione in classifica:
            <input
              type="number"
              min="1"
              max="10"
              value={position}
              onChange={(e) => setPosition(parseInt(e.target.value))}
            />
          </label>
        </div>
        
        <button onClick={calculateRevenue} className="calculate-button">
          Calcola Ricavi
        </button>
        
        {calculatedRevenue !== null && (
          <div className="result">
            <h4>Ricavo Calcolato: {calculatedRevenue} crediti</h4>
            <button onClick={saveRevenue} className="save-button">
              Salva Ricavo
            </button>
          </div>
        )}
      </div>
      
      <div className="actions">
        <Link to={`/team/${id}`} className="button">
          Torna ai Dettagli Squadra
        </Link>
      </div>
    </div>
  );
}

export default StadiumManagement;
