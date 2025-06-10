// Interfície per a cada bomber importat

export function createBomberInterface({bomber, container, minutsInputSet,  onDelete, allTrackers }){
  
    // Crea div al menú lateral per mostrar les dades importades del bomber
    const bomberDiv = document.createElement('div');
    
    bomberDiv.classList.add('menu-option');
    bomberDiv.id = `bomber-${bomber.id_bomber}`;
    bomberDiv.innerHTML = `

      <div class="bomber-topbar">
        <i class="fas fa-stopwatch stop-timer green-color" title="Parar timer" style="cursor:pointer;"></i>
        <i class="fas fa-trash-alt delete-bomber" title="Elimina bomber"></i>
      
    </div>
    
    
    <div class="bomber-header">
        <img src="src/icons/firefighter_48.png" alt="Avatar bomber" class="bomber-avatar large">
        <img src="src/icons/firefighter_32.png" alt="Avatar bomber" class="bomber-avatar small">
        <div class="bomber-info">
            <p class="bomber-name">${bomber.nom_bomber}</p>
            <p class="bomber-id">ID: ${bomber.id_bomber}</p>
        </div>
    </div>

  <div class="bomber-status">
    <div class="status-row">
      <img src="src/icons/oxigen_48.png" alt="Icona Oxigen">
      <span class="oxigen-value">--%</span>
    </div>
    <div class="status-row">
      <img src="src/icons/heart_48.png" alt="Icona BPM">
      <span class="bpm-value">-- bpm</span>
    </div>
  </div>
`;

    // Eliminar 
    bomberDiv.querySelector('.delete-bomber').addEventListener('click', ()=>{
        bomberDiv.remove();
        document.getElementById(`tracking-${bomber.id_bomber}`)?.remove();
        onDelete(bomber.id_bomber);
    });

    bomberDiv.querySelector('.stop-timer').addEventListener('click', ()=>{
        const tracker = allTrackers.find(t => t.bomberId === bomber.id_bomber);
        const timeDisplay = tracker.timerElement?.querySelector(`#timeElapsed-${bomber.id_bomber}`);
        const alarmTime = parseInt(minutsInputSet.value) * 60;

        if(!tracker){
            return;
        } 
        
        // Si el timer està actiu pausa'l
        if(tracker.timerIntervalId){
            // Al fer click es canvia el color de les icones
            bomberDiv.querySelector('.stop-timer').classList.remove('green-color');
            bomberDiv.querySelector('.stop-timer').classList.add('blue-color');

            clearInterval(tracker.timerIntervalId);
            tracker.timerIntervalId = null;

            if(timeDisplay){            
                timeDisplay.style.color = 'gray';
            }
        } 
        else{
            // Al fer click es canvia el color de les icones
            bomberDiv.querySelector('.stop-timer').classList.remove('blue-color');
            bomberDiv.querySelector('.stop-timer').classList.add('green-color');
            
            // Reprèn el timer
            tracker.timerIntervalId = setInterval(() => {
                tracker.elapsedTime += 1;

                if(timeDisplay){
                    timeDisplay.textContent = `${tracker.elapsedTime}s`;
                    if(tracker.elapsedTime >= alarmTime){
                        timeDisplay.classList.add('red-text');
                    }
                }
            }, 1000);

            if(timeDisplay){
                timeDisplay.style.color = '';
            }
        }
    });

    container.appendChild(bomberDiv);
    return bomberDiv;
}
