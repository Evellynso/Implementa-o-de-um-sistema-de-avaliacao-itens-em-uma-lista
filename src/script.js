document.addEventListener('DOMContentLoaded', () => {
    const itens = document.querySelectorAll('.item');
    const botaoSalvar = document.getElementById('botao-salvar');
    const mensagemSalvar = document.getElementById('mensagem-salvar');

    // Objeto para armazenar seleções temporárias
    let selecoesTemporarias = {};

    itens.forEach(item => {
        const estrelas = item.querySelectorAll('.estrela');
        const infoAvaliacao = item.querySelector('.info-avaliacao');
        const mediaSpan = item.querySelector('.media');
        const itemId = item.getAttribute('data-id');

        // Carregar avaliação inicial do armazenamento local
        const avaliacaoArmazenada = JSON.parse(localStorage.getItem(`avaliacao-${itemId}`));
        if (avaliacaoArmazenada) {
            atualizarEstrelas(estrelas, avaliacaoArmazenada.media);
            atualizarInfoAvaliacao(infoAvaliacao, avaliacaoArmazenada.media, avaliacaoArmazenada.contagem);
        }

        estrelas.forEach(estrela => {
            estrela.addEventListener('click', () => {
                const valor = parseInt(estrela.getAttribute('data-valor'));

                // Atualizar seleção temporária
                selecoesTemporarias[itemId] = valor;

                // Atualizar estrelas temporariamente
                atualizarEstrelas(estrelas, valor);
            });
        });
    });

    botaoSalvar.addEventListener('click', () => {
        // Salvar seleções temporárias no armazenamento local como avaliações
        for (let itemId in selecoesTemporarias) {
            const valor = selecoesTemporarias[itemId];

            let avaliacaoAtual = JSON.parse(localStorage.getItem(`avaliacao-${itemId}`)) || { soma: 0, contagem: 0 };
            avaliacaoAtual.soma += valor;
            avaliacaoAtual.contagem += 1;
            avaliacaoAtual.media = avaliacaoAtual.soma / avaliacaoAtual.contagem;

            localStorage.setItem(`avaliacao-${itemId}`, JSON.stringify(avaliacaoAtual));

            // Atualizar informações de avaliação na interface
            const item = document.querySelector(`.item[data-id="${itemId}"]`);
            const infoAvaliacao = item.querySelector('.info-avaliacao');
            atualizarInfoAvaliacao(infoAvaliacao, avaliacaoAtual.media, avaliacaoAtual.contagem);
        }

        // Mostrar mensagem de salvamento
        mensagemSalvar.style.display = 'block';
        // Ocultar a mensagem após 2 segundos
        setTimeout(() => {
            mensagemSalvar.style.display = 'none';
        }, 2000);

        // Limpar seleções temporárias
        selecoesTemporarias = {};
    });

    function atualizarEstrelas(estrelas, avaliacao) {
        estrelas.forEach(estrela => {
            estrela.classList.remove('selecionada');
            if (parseInt(estrela.getAttribute('data-valor')) <= avaliacao) {
                estrela.classList.add('selecionada');
            }
        });
    }

    function atualizarInfoAvaliacao(elemento, media, contagem) {
        elemento.querySelector('.media').textContent = media.toFixed(1);
        elemento.innerHTML = `Avaliação média: <span class="media">${media.toFixed(1)}</span> (${contagem} avaliações)`;
    }
});
