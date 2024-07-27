
document.addEventListener("DOMContentLoaded", function() {
    let articles = [];
    const articleForm = document.getElementById('form');
    const articleIdInput = document.getElementById('article-id');
    const articleNameInput = document.getElementById('name');
    const piecesContainer = document.getElementById('pieces-container');
    const articlesTableBody = document.getElementById('articles');
    const maxPieces = 40;

    // Cargar artículos de localStorage
    function loadArticles() {
        const storedArticles = localStorage.getItem('articles');
        if (storedArticles) {
            articles = JSON.parse(storedArticles);
            renderArticles();
        }
    }

    // Guardar artículos en localStorage
    function saveArticles() {
        localStorage.setItem('articles', JSON.stringify(articles));
    }

    // Renderizar la lista de artículos en la tabla
    function renderArticles() {
        articlesTableBody.innerHTML = '';
        articles.forEach((article, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${article.name}</td>
                ${article.pieces.map(piece => `<td>${piece}</td>`).join('')}
                ${Array.from({ length: maxPieces - article.pieces.length }, () => `<td></td>`).join('')}
                <td class="actions">
                    <button onclick="editArticle(${index})">Editar</button>
                    <button onclick="deleteArticle(${index})">Eliminar</button>
                </td>
            `;
            articlesTableBody.appendChild(row);
        });
    }

    // Crear campos para las piezas en 3 columnas
    function createPieceFields(pieces) {
        piecesContainer.innerHTML = '';
        for (let i = 0; i < maxPieces; i++) {
            const pieceInput = document.createElement('input');
            pieceInput.type = 'text';
            pieceInput.placeholder = `Pieza ${i + 1}`;
            pieceInput.value = pieces[i] || '';
            piecesContainer.appendChild(pieceInput);
        }
    }

    // Manejar el formulario de artículo
    articleForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const articleId = articleIdInput.value;
        const articleName = articleNameInput.value;
        const articlePieces = Array.from(piecesContainer.querySelectorAll('input')).map(input => input.value);

        if (articleId) {
            // Editar artículo existente
            const articleIndex = articles.findIndex(article => article.id == articleId);
            articles[articleIndex].name = articleName;
            articles[articleIndex].pieces = articlePieces;
        } else {
            // Agregar nuevo artículo
            const newArticle = {
                id: Date.now(),
                name: articleName,
                pieces: articlePieces
            };
            articles.push(newArticle);
        }

        articleForm.reset();
        createPieceFields([]);
        saveArticles();
        renderArticles();
    });

    // Función para editar artículo
    window.editArticle = function(index) {
        const article = articles[index];
        articleIdInput.value = article.id;
        articleNameInput.value = article.name;
        createPieceFields(article.pieces);
    };

    // Función para eliminar artículo
    window.deleteArticle = function(index) {
        articles.splice(index, 1);
        saveArticles();
        renderArticles();
    };

    // Inicializar campos de piezas vacíos
    createPieceFields([]);

    // Cargar los artículos al iniciar la aplicación
    loadArticles();
});
