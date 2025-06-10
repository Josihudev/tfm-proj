// Mòdul crear BPM's (monitor ritme cardíac)
export function createHealth({onUpdate}){
  
    let isMonitoringHeart = false;
    
    function update(bpm){
        if(typeof onUpdate === 'function'){
            onUpdate(bpm);
        }
    }

    return {
        update,             
        setMonitoringHeart: (state)=>{
            isMonitoringHeart = state;
        }
    };
}
