
// Afficher le dossier d'un pastient (A utiliser unique dans le coté patient)
export default function GenererDossier({Dossier}){
    return (
       <>
         <div className="dossier-patient">
            <h2>Mon dossier médical</h2>
            <div className="informations-personnelles">
             <p className="info-perso nom"> Nom: {Dossier.nom}</p>
             <p className="info-perso prenom"> Prénom: {Dossier.prenom}</p>
             <p className="info-perso age"> Age: {Dossier.age} ans</p>
             <p className="info-perso sexe"> Sexe: {Dossier.sexe}</p>
             <p className="info-perso adresse"> Adresse: {Dossier.adresse}</p>
             <p className="info-perso "> Groupe sanguin: {Dossier.groupe}</p>
              <ul className="liste-antecedent">
                <p>Antécédents médicaux</p>
                {Dossier.antecedent.map((antecedent, index) => 
                    <li className="antecedent">
                        <span>{index+1}   {antecedent}</span>
                    </li>
                )}

              </ul>
            </div>
         </div>
       
       
       
       
       
       
       </>
    )
}