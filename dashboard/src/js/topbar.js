// Menú superior
export function initTopbar(){

    document.addEventListener('DOMContentLoaded', ()=>{

        // Control apertura menús laterals
        const controlMap = document.getElementById('controlMap');
        const controlOptions = document.getElementById('controlOptions');        
        const toggleMenuMapBtn = document.getElementById('toggleMenuMapBtn');        
        const toggleMenuOptionsBtn = document.getElementById('toggleMenuOptionsBtn');        
        const iconMap = toggleMenuMapBtn.querySelector('i');
        const iconOptions = toggleMenuOptionsBtn.querySelector('i');
       
        let menuMap = false;
        let menuOptions = false;

        // Botó - Menú Control Intervenció (dreta)
        toggleMenuMapBtn.addEventListener('click', ()=>{

            menuMap = !menuMap;            
            toggleMenuMapBtn.classList.add('rotating');

            // Tanca el menu Opcions si està obert
            if(menuOptions){
                menuOptions = false;
                controlOptions.classList.remove('open');
                // Canvia el botó
                iconOptions.classList.remove('fa-times');
                iconOptions.classList.add('fa-bars');
            }
    
            // Retard icona per permetre la rotació
            setTimeout(() => {
                iconMap.classList.toggle('fa-bars', !menuMap);
                iconMap.classList.toggle('fa-times', menuMap);
                toggleMenuMapBtn.classList.remove('rotating');
            }, 150); 

            controlMap.classList.toggle('open', menuMap);
            iconMap.classList.toggle('fa-bars', !menuMap);
            iconMap.classList.toggle('fa-times', menuMap);
        });
        
        // Botó - Menú OPcions(esquerra)
        toggleMenuOptionsBtn.addEventListener('click', ()=>{
            menuOptions = !menuOptions;
            toggleMenuOptionsBtn.classList.add('rotating');
        
            // Tanca el Menú del Control de la Intervenció si està obert
            if(menuMap){
                menuMap = false;
                controlMap.classList.remove('open');
                // Canvia el botó
                iconMap.classList.remove('fa-times');
                iconMap.classList.add('fa-bars');
            }

            // Retard icona per permetre la rotació
            setTimeout(() => {
                iconOptions.classList.toggle('fa-sliders-h', !menuOptions);
                iconOptions.classList.toggle('fa-times', menuOptions);
                toggleMenuOptionsBtn.classList.remove('rotating');
            }, 150); 
        
            controlOptions.classList.toggle('open', menuOptions);
            iconOptions.classList.toggle('fa-sliders-h', !menuOptions);
            iconOptions.classList.toggle('fa-times', menuOptions);
        });
        
        // Inicialització
        controlMap.classList.add('right'); // per defecte a la dreta
        controlOptions.classList.add('left'); // per defecte a l'esquerra

        // Amagar la barra superior amb fletxeta
        const topBar = document.getElementById('topBar');
        const toggleTab = document.getElementById('toggleTab');

        let isHidden = false;

        toggleTab.addEventListener('click', () => {
            isHidden = !isHidden;
            topBar.classList.toggle('hidden', isHidden);
            toggleTab.classList.toggle('down', isHidden);
            toggleTab.classList.toggle('up', !isHidden);
            toggleTab.innerHTML = isHidden?'<i class="fas fa-chevron-down"></i>':'<i class="fas fa-chevron-up"></i>';
        });
    });
}

export function closeAllMenus(){

    if(controlOptions.classList.contains("open")){
        
        const toggleMenuOptionsBtn = document.getElementById('toggleMenuOptionsBtn');

        if(toggleMenuOptionsBtn){ // Mira si s'ha carregat
            toggleMenuOptionsBtn.click(); // Simula el clic del botó Opcions (el 1er) del menú superior
        }             
    }

    if(controlMap.classList.contains("open")){

        const toggleMenuMapBtn = document.getElementById('toggleMenuMapBtn');

        if(toggleMenuMapBtn){ // Mira si s'ha carregat
            toggleMenuMapBtn.click(); // Simula el clic del botó Intervenció (el darrer) del menú superior
        }             
    }    
}

export function openMenu(menulateral){

    switch(menulateral){

        case "opcions":
            if(!controlOptions.classList.contains("open")){ // Si está tancat, l'obra

                const toggleMenuOptionsBtn = document.getElementById('toggleMenuOptionsBtn');

                if(toggleMenuOptionsBtn){ // Mira si s'ha carregat
                    toggleMenuOptionsBtn.click(); // Simula el clic del botó Opcions (el 1er) del menú superior
                }             
            }

        break;
        case "intervencio":

            if(!controlMap.classList.contains("open")){// Si está tancat, l'obra

                const toggleMenuMapBtn = document.getElementById('toggleMenuMapBtn');

                if(toggleMenuMapBtn){ // Mira si s'ha carregat
                    toggleMenuMapBtn.click(); // Simula el clic del botó Intervenció (el darrer) del menú superior
                }             
            }

        break;
        default:
    }
}
