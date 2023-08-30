const dataContainer = document.getElementById('data-container');
const dataContainer2 = document.getElementById('data-container2');
const startBtn = document.getElementById('startBtn');
const firstBtn = document.getElementById('firstBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let currentPage = 1;
let data = []; // Array para armazenar todos os dados da primeira API
let data2 = []; // Array para armazenar todos os dados da segunda API
const itemsPerPage = 10;

// Nomes personalizados das colunas
const columnNames = {
    num_pedido: 'Pedido',
    passo_1: 'P1',
    passo_2: 'P2',
    data_consulta: 'Data',
    cod_ped_inter: 'Cod. Pedido',
    email: 'Setor'
};

function renderTable(pageData, container) {
    // Processando e exibindo os dados
    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Cabeçalho da tabela
    const headerRow = document.createElement('tr');
    for (const key in pageData[0]) {
        if (key !== 'ID') {
            const th = document.createElement('th');
            th.textContent = columnNames[key] || key; 
            headerRow.appendChild(th);
        }
    }
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    // Linhas de dados
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('zoomable'); 
        for (const key in item) {
            if (key !== 'ID') {
                const cell = document.createElement('td');
                cell.textContent = item[key];
                row.appendChild(cell);
            }
        }
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);

    // Atualizar página atual
    currentPageSpan.textContent = `Página ${currentPage}`;

    // Adicionando a tabela ao container
    container.innerHTML = '';
    container.appendChild(table);

    // Adicionar eventos de zoom
    const zoomableElements = document.querySelectorAll('.zoomable');
    zoomableElements.forEach(element => {
        element.addEventListener('mouseover', () => {
            element.style.transform = 'scale(1.1)';
            element.style.transition = 'transform 0.3s';
        });

        element.addEventListener('mouseout', () => {
            element.style.transform = 'scale(1)';
            element.style.transition = 'transform 0.3s';
        });
    });
}

function updatePage(direction, pageData, container) {
    if (direction === 'first') {
        currentPage = 1;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < Math.ceil(pageData.length / itemsPerPage)) {
        currentPage++;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageDataToShow = pageData.slice(startIndex, endIndex);
    renderTable(pageDataToShow, container);
}

function fetchAndRenderData1() {
    axios.get('http://192.168.0.52:1880/fiscal.visual')
        .then(response => {
            data = response.data;
            updatePage('first', data, dataContainer); // Renderizar a primeira página da primeira API
        })
        .catch(error => {
            console.error('Erro ao buscar dados da primeira API:', error);
        });
}

function fetchAndRenderData2() {
    axios.get('/apiBanco')
        .then(response => {
            data2 = response.data;
            updatePage('first', data2, dataContainer2); // Renderizar a primeira página da segunda API
        })
        .catch(error => {
            console.error('Erro ao buscar dados da segunda API:', error);
        });
}

function startApi() {
    axios.get('/start')
        .then(response => {
            console.log('API started successfully:', response.data);
        })
        .catch(error => {
            console.error('Error starting API:', error);
        });
}

function searchByNumPedido() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        const filteredData = data.filter(item => item.num_pedido.includes(searchTerm));
        updatePage('first', filteredData, dataContainer);
    }
}

startBtn.addEventListener('click', startApi);
firstBtn.addEventListener('click', () => updatePage('first', data, dataContainer));
prevBtn.addEventListener('click', () => updatePage('prev', data, dataContainer));
nextBtn.addEventListener('click', () => updatePage('next', data, dataContainer));
searchBtn.addEventListener('click', searchByNumPedido);

//buscar e renderizar os dados da primeira API
fetchAndRenderData1();
fetchAndRenderData2();

// Buscar e renderizar os dados da segunda API a cada 5 segundos
    setInterval(fetchAndRenderData2, 5000);

//criar o gráfico de pizza
var ctx = document.getElementById('pizzaChart').getContext('2d');
var pizzaChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Faturadas: '+4946, 'Erro: '+47],
        datasets: [{
            data: [4946, 47], 
            backgroundColor: ['#45ff4d', '#ff6262'], 
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Gráfico de Pizza'
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff', 
                    font: {
                        weight: 'bold' 
                    }
                }
            }
        }
    }
});
