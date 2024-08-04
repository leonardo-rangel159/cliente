document.addEventListener('DOMContentLoaded', function() {
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');

    // Função para buscar estados
    async function carregarEstados() {
        try {
            const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
            const data = await response.json();
            data.sort((a, b) => a.nome.localeCompare(b.nome));
            data.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.nome;
                estadoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar estados:', error);
        }
    }

    // Função para buscar cidades por estado
    async function carregarCidades(estado) {
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`);
            const data = await response.json();
            // Ordenar cidades por nome
            data.sort((a, b) => a.nome.localeCompare(b.nome));
            cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>'; // Resetar cidades
            data.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome; // Usar o nome da cidade como valor
                option.textContent = cidade.nome;
                cidadeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar cidades:', error);
        }
    }

    // Função para remover acentos e substituir espaços por hífens
    function formatarNome(nome) {
        return nome
            .normalize('NFD') // Normaliza o texto para decomposição de acentuação
            .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .toLowerCase(); // Converte para letras minúsculas
    }

    // Função para redirecionar para a página de cartórios
    function abrirPaginaCartorios(estado, cidade) {
        const url = `https://certidaoonlinebrasil.com.br/cartorios/${estado}/${cidade}`;
        window.open(url, '_blank'); // Abrir em uma nova aba
    }

    // Evento para carregar cidades ao mudar o estado
    estadoSelect.addEventListener('change', function() {
        const estado = estadoSelect.value.toLowerCase();
        if (estado) {
            carregarCidades(estado);
        } else {
            cidadeSelect.innerHTML = '<option value="">Selecione uma cidade</option>';
        }
    });

    // Evento para redirecionar ao clicar em buscar
    document.getElementById('cartorioForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const estado = estadoSelect.value.toLowerCase();
        const cidade = formatarNome(cidadeSelect.value);
        if (estado && cidade) {
            abrirPaginaCartorios(estado, cidade);
        }
    });

    // Carregar estados ao iniciar
    carregarEstados();
});
