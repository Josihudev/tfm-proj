// Controlador del modal d'importació de bombers
import { closeAllMenus, openMenu } from './topbar';

export function setupImportModal({onOpen, onSelectBomber}){

    document.addEventListener('DOMContentLoaded', ()=>{

        const importModal = document.getElementById('importModal');
        const importDataBtn = document.getElementById('importDataBtn');
        const closeModalBtn = document.getElementById('closeImportModal');
        const modalFileSelect = document.getElementById('modalFileSelect');
        const overlay = document.getElementById('overlayid');

        // Obre el modal
        importDataBtn.addEventListener('click', async ()=>{

            // Tanca tots els menús oberts
            closeAllMenus();
            
            importModal.classList.remove('hidden');
            importModal.classList.add('active');
            overlay.classList.add('active');

            modalFileSelect.innerHTML = '<option value="">-- Selecciona un bomber --</option>';
            
            await onOpen(modalFileSelect);           
        });

        // Tria del bomber
        modalFileSelect.addEventListener('change', (e)=>{
            const selectedIndex = e.target.value;
            if(selectedIndex !== ''){
                onSelectBomber(parseInt(selectedIndex));
                // Tanca modal i treu capa d'overlay
                importModal.classList.add('hidden');
                importModal.classList.remove('active');           
                overlay.classList.remove('active');

                // Obra el menú de la intervenció per mostrar el bomber triat
                openMenu("intervencio");;
            }
        });

        // Tanca el modal
        closeModalBtn.addEventListener('click', ()=>{
            
            // Tanca modal i treu capa d'overlay
            overlay.classList.remove('active');
            importModal.classList.add('hidden');
            importModal.classList.remove('active');                       
        });
    });
}
