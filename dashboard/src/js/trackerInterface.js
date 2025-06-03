export function createTrackerInterface({ bomber, map, createTracker, container, minutsInputSet }){

    // Color del tracker
    const color = getNextColor();
    nextColorIndex++;

    // Creació del tracker 
    const tracker = createTracker({
        map: map,
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        color: color,
        name: bomber.nom_bomber
    });

    tracker.bomberId = bomber.id_bomber;

    console.log(container);

    // Pinta el div del bomber del mateix color que el traacker
    const bomberCont = document.getElementById(`bomber-${bomber.id_bomber}`);
    
    bomberCont.style.border = `4px solid ${color}`; // Mateix color que el tracker
    bomberCont.style.borderRadius = '8px';         // Cantonades arrodonides (opcional)
    bomberCont.style.padding = '10px';             // Espai intern (opcional)
    bomberCont.style.marginBottom = '10px';        // Separació entre elements (opcional)

    // Div i botó de seguiment (només mostra/amaga)
    const trackingBtn = document.createElement('button');
    trackingBtn.classList.add("tracking-toggle");
    trackingBtn.innerHTML = `
    <img src="src/icons/hide_32.png" alt="Amaga Seguiment">
    `;

    let isVisible = true;
    trackingBtn.addEventListener('click', function (){
        isVisible = !isVisible;
        tracker.iconLayer.setVisible(isVisible);
        tracker.lineLayer.setVisible(isVisible);
        
        const img = this.querySelector('img');
        if (isVisible){
            img.src = "src/icons/hide_32.png"; // Canvia la imatge a 'hide'
            img.alt = 'Amaga Seguiment';            
        } 
        else{
            img.src = "src/icons/visible_32.png"; // Canvia la imatge a 'visible'
            img.alt = 'Mostra Seguiment';            
        }
    });

    // Timer per controlar l'estada a l'interior
    const { timerElement, intervalId, stop } = setupTimer(minutsInputSet, bomber.id_bomber, tracker);
    tracker.timerElement = timerElement;
    tracker.timerIntervalId = intervalId;
    tracker.elapsedTime = 0;

    // Checkbox línia rastreig
    const checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add("tracking-checkbox");
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.addEventListener('change', () => tracker.setLineVisible(checkbox.checked));
    const label = document.createElement('label');
    label.textContent = `Tracker`;
    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);

    return {
        tracker,
        elements: { trackingBtn, timerElement, checkboxDiv },
        color
    };
}

// -------------------------- Funcions --------------------------

    const COLORS = ['blue', 'green', 'red', 'orange', 'purple', 'teal', 'brown', 'magenta'];
    let nextColorIndex = 0;   
    
    function getNextColor(){
        const color = COLORS[nextColorIndex % COLORS.length];
        nextColorIndex++;
        return color;
    }

    function setupTimer(minutsInputSet, bomberId, tracker){
        const alarmTime = parseInt(minutsInputSet.value) * 60;
        const timeElapsedDivInside = document.createElement('div');
        timeElapsedDivInside.classList.add("menu-option");

        const timeElapsedDiv = document.createElement('div');
        timeElapsedDiv.id = `timeElapsed-${bomberId}`;
        timeElapsedDiv.classList.add('.elapsed-timer');
        
        timeElapsedDiv.textContent = "0";
        
        let elapsedTime = 0;
        const intervalId = setInterval(()=>{
            elapsedTime++;
            timeElapsedDiv.textContent = `${elapsedTime}s`;

            if (elapsedTime >= alarmTime){
                timeElapsedDiv.classList.add('red-text');
            }
            // Guardem el temps dins del tracker    
            tracker.elapsedTime = elapsedTime;
        }, 1000);

        timeElapsedDivInside.appendChild(timeElapsedDiv);

        return {
            timerElement: timeElapsedDivInside,
            intervalId,
            stop: ()=> clearInterval(intervalId)
        };
    }
    