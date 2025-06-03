export function initSidebar(){

    document.addEventListener('DOMContentLoaded', ()=>{

        const positionSelect = document.getElementById('positionSelect');
        const controlMap = document.getElementById('controlMap');
        const minutsInputBtn = document.getElementById('minutsInputBtn');    
        const oxigenInputBtn = document.getElementById('oxigenInputBtn');               
        const bpmInputBtn = document.getElementById('bpmInputBtn');       
        const closeMenuOptions = document.getElementById('closeMenuOptions');   
        const closeMenuIntervencio = document.getElementById('closeMenuIntervencio');   

        let minutsSeleccionats = 0;

        // Setejador alarma minuts: Limitarem els temps màx. que un bomber pot estar a línterior de l'edifici amb una alarma.
        minutsInputBtn.addEventListener('click', ()=>{
            const input = document.getElementById('minutsInput');
            const minutsSet = document.getElementById('minutsInputSet');
            const valor = parseInt(input.value, 10);

            if(!isNaN(valor) && valor >= 1 && valor <= 99){ // Valors: [1,..,99]                
                minutsSeleccionats = valor;
                // Marca el contorn de la casella en vermell
                input.classList.add('highlight-red');
                // Guarda el temps de l'alarma en un div ocult per ser llegit des d'on es necessiti
                minutsSet.value = minutsSeleccionats;
                console.log("Minuts seleccionats:", minutsSeleccionats);
            } 
            else{
                alert("Introdueix un valor entre 1 i 99");
            }
        });

        //---------------------------------------------------------

        let oxigenSeleccionats = 0;
        // Setejador alarma oxigen: Limitarem els % d'oxígen. mínim d'una botella
        oxigenInputBtn.addEventListener('click', ()=>{
            const input = document.getElementById('oxigenInput');
            const oxigenSet = document.getElementById('oxigenInputSet');
            const valor = parseInt(input.value, 10);

            if(!isNaN(valor) && valor >= 0 && valor <= 100){ // Valors: [0,..,100]
                
                oxigenSeleccionats = valor;
                // Marca el contorn de la casella en vermell
                input.classList.add('highlight-red');
                // Guardo el temps de l'alarma en un div ocult per ser llegit des d'on es necessiti
                oxigenSet.value = oxigenSeleccionats;
                console.log("% oxigen seleccionats:", oxigenSeleccionats);
            } 
            else{
                alert("Introdueix un valor entre 0 i 100");
            }
        });
        //---------------------------------------------------------

        let bpmSeleccionats = 0;
        // Setejador alarma oxigen: Limitarem els % d'oxígen. mínim d'una botella
        bpmInputBtn.addEventListener('click', ()=>{
            const input = document.getElementById('bpmInput');
            const bpmSet = document.getElementById('bpmInputSet');
            const valor = parseInt(input.value, 10);

            if(!isNaN(valor) && valor >= 30 && valor <= 230){ // Valors: [30,..,230]
                
                bpmSeleccionats = valor;
                // Marca el contorn de la casella en vermell
                input.classList.add('highlight-red');
                // Guardo el temps de l'alarma en un div ocult per ser llegit des d'on es necessiti
                bpmSet.value = bpmSeleccionats;
                console.log("bpm seleccionats:", bpmSeleccionats);
            } 
            else{
                alert("Introdueix un valor entre 30 i 230");
            }
        });

        // Selector posicionar menú mapa 
        positionSelect.addEventListener('change',(e)=>{ 
            const pos = e.target.value;
            controlMap.classList.remove('left', 'right', 'open');
            controlMap.classList.add(pos);           
        });


        // Tancar menú Opcions amb el botó X
        closeMenuOptions.addEventListener('click', ()=>{

            const toggleMenuOptionsBtn = document.getElementById('toggleMenuOptionsBtn');

            if(toggleMenuOptionsBtn){ // Mira si s'ha carregat
                toggleMenuOptionsBtn.click(); // Simula el clic del botó Opcions (el 1er) del menú superior
            }             
        });

        closeMenuIntervencio.addEventListener('click', ()=>{

            const toggleMenuMapBtn = document.getElementById('toggleMenuMapBtn');

            if(toggleMenuMapBtn){ // Mira si s'ha carregat
                toggleMenuMapBtn.click(); // Simula el clic del botó Intervenció (el darrer) del menú superior
            }             
        });        
    });
}
