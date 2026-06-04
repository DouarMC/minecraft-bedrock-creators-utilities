let selectedFile = null;

// Dom Elements
const fileList = document.getElementById('file-list');
const currentFileTitle = document.getElementById('current-file');
const editorZone = document.getElementById('editor-zone');
const newVersionInput = document.getElementById('new-version');
const btnAddVersion = document.getElementById('btn-add-version');
const versionStatus = document.getElementById('version-status');

// 1. Charger la liste des fichiers au démarrage
fetch('/api/files')
    .then(res => res.json())
    .then(files => {
        fileList.innerHTML = '';
        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerText = file;
            div.onclick = () => selectFile(file, div);
            fileList.appendChild(div);
        });
    })
    .catch(err => console.error("Impossible de charger les fichiers:", err));

// 2. Sélectionner un fichier
function selectFile(filePath, element) {
    selectedFile = filePath;
    
    // Reset graphique de la liste
    document.querySelectorAll('.file-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    // Affichage de la zone d'édition
    currentFileTitle.innerText = filePath;
    editorZone.style.display = 'block';
    resetStatus();
}

// 3. Envoyer la demande d'ajout de version
btnAddVersion.onclick = () => {
    const version = newVersionInput.value.trim();
    if (!version || !selectedFile) {
        showStatus('Veuillez entrer une version valide.', 'error');
        return;
    }

    resetStatus();

    fetch('/api/add-version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileRelativePath: selectedFile, version: version })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showStatus(data.message, 'success');
            newVersionInput.value = '';
        } else {
            showStatus(data.error, 'error');
        }
    })
    .catch(err => {
        showStatus("Erreur réseau ou serveur hors ligne.", 'error');
    });
};

function showStatus(message, type) {
    versionStatus.innerText = message;
    versionStatus.className = `status ${type}`;
}

function resetStatus() {
    versionStatus.innerText = '';
    versionStatus.className = 'status';
}