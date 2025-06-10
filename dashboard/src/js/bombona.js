// Mòdul Crear Bombona 
export function createBombona({onUpdate}){
  
    let isConsumingOxigen = false;
    
    function update(oxigen){
        if(typeof onUpdate === 'function'){
            onUpdate(oxigen);
        }
    }

    return {
        update,             
        setConsumingOxigen: (state)=>{
            isConsumingOxigen = state;
        }
    };
}
