// Mòdul crear BPM's

export function createHealth({onUpdate}){
  
    let isMonitoringHeart = false;
    
    function update(bpm){
        if (typeof onUpdate === 'function'){
            onUpdate(bpm);
        }
    }

    return {
        update,             
        setMonitoringHeart: (state) => {
            isMonitoringHeart = state;
        }
    };
}
