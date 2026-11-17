# Caçador de Sites

Ferramenta pra achar negócios que vão bem no Google Maps (muitas avaliações, nota alta) mas não têm site próprio, pontuar cada um de 0 a 100 e montar a mensagem de abordagem.

Acesse: https://cachinnas.github.io/cacador/

## Como usar
1. Abra a aba **Configurar** e cole sua chave da API do Google (Maps JavaScript API + Places API (New)). A chave fica salva só no seu navegador.
2. Na aba **Caçar**, escolha nichos, cidade e bairros e clique em **Começar caçada**.
3. Em **Resultados**, filtre os quentes, monte a mensagem e baixe a planilha em Excel ou CSV.

Sem chave, o botão **Ver exemplo de Natal** mostra uma caçada real feita em 12/11/2026.

## Pasta `ferramentas`
- `cacar.js`: extrator que roda dentro do Google Maps no navegador (usado pela versão com Claude + Chrome).
- `pontuar.py`: o mesmo algoritmo de pontuação em Python.
