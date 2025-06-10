// Client per connectar amb l'API

// Obtenir dades bomber
export async function fetchBomberStatus({ idBomber, originData }){

    const res = await fetch(`http://localhost/api-rest/index.php?id_bomber=${idBomber}&origin_data=${originData}`, {
    
        credentials: 'include',
        headers:{
            'Content-Type': 'application/json'
        }
    });
    if(!res.ok){
        throw new Error("Error en la petició a l'API");
    }
    
    const data = await res.json();

    const { bpm, oxigen_percent, latitude, longitude } = data;
    return{
        oxigen: parseFloat(oxigen_percent),
        position: { latitude, longitude },
        bpm:  parseFloat(bpm)
    };
}

// Reiniciar sessió bomber
export async function resetSimulation( idBomber, originData){

    console.log("originData:",originData);
    try{
        const res = await fetch(`http://localhost/api-rest/index.php?id_bomber=${idBomber}&origin_data=${originData}&reset=1`, {
      
            credentials: 'include'
        });
        if(!res.ok){
            throw new Error("Error en el reinici de la sessió");
        }
    }
    catch(e){
        console.warn("No s’ha pogut reiniciar la sessió:", e);
    }
}
