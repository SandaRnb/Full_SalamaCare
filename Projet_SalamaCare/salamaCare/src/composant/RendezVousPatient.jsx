export default function Formulaire(){
    return (
        <>
        <div className="formulaire-rdv">
            <div className="in-form in-date">
                <label className="label" htmlFor="date">Date</label>
                <input type="date" name="date" id="" />
            </div>
            <div className="in-form in-heure">
                <label className="label" htmlFor="heure">Heure</label>
                <input type="date-time" name="heure" id="" />
            </div>
            <div className="in-form in-motif">
                <label className="label" htmlFor="motif">Motif</label>
                <input type="text" name="motif" id="" placeholder="Quel motif?" />
            </div>

           <div>
            <label className="label" htmlFor="in-form medecin">Médecin</label>
             <select name="medecin" id="">
                <option value="">Marley</option>
                <option value="">Fally</option>
                <option value="">Soa Donia</option>
                <option value="">Elgin</option>
            </select>
           </div>

            <button type="submit">
                Réserver
            </button>
        
        
        
        </div>
        
        
        
        
        </>
    )
}


export function ListeRendezVous({ RendezVous }) {
    // 1. Sécurité : Si la liste n'existe pas ou est vide
    if (!RendezVous || RendezVous.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                <p>Aucun rendez-vous de prévu.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Liste des Rendez-vous</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px' }}>Médecin/ Motif</th>
                        <th style={{ padding: '12px' }}>Date & Heure</th>
                        <th style={{ padding: '12px' }}>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {RendezVous.map((rdv) => (
                        <tr key={rdv.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>
                                <strong>{rdv.medecin}</strong>
                                <span style={{ display: 'block', fontSize: '0.85em', color: '#666' }}>
                                    {rdv.motif}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                {/* Formatage de la date en français si rdv.date est un objet Date ou une string ISO */}
                                {new Date(rdv.date).toLocaleString('fr-FR', {
                                    dateStyle: 'short',
                                    timeStyle: 'short'
                                })}
                            </td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.85em',
                                    backgroundColor: rdv.statut === 'Confirmé' ? '#e6f4ea' : '#feeee8',
                                    color: rdv.statut === 'Confirmé' ? '#137333' : '#c26100'
                                }}>
                                    {rdv.statut}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}