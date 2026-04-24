# Guia de Edição: Memorial Digital Família Imoto

Este sistema foi construído para ser uma cápsula do tempo digital dinâmica.

## 📊 1. O Banco de Dados (Google Sheets)
O site é alimentado por uma **Planilha do Google**.

### Configuração:
1. Crie uma planilha com as colunas: `Preview`, `Tipo`, `Titulo`, `Local`, `Ano`, `ID_Drive`, `Categoria`, `Contexto`, `Original`, `Traducao`, `Citacoes`.
2. Em **Arquivo > Compartilhar > Publicar na Web**, publique como **CSV**.
3. Copie o **ID da Planilha** e substitua no código dos arquivos `Gallery.tsx` e `Documents.tsx`.

## 🚀 2. Automação (Apps Script)
Use o código fornecido no `walkthrough.md` para catalogar sua pasta do Google Drive automaticamente na planilha. O script gerará miniaturas visuais para facilitar a edição.

## 🌳 3. Árvore Genealógica
Editada via código no arquivo `src/pages/Genealogy.tsx`. Procure pela constante `FAMILY_DATA`.

## 🎨 4. Design e Estética
- **Cores**: `text-primary` (#990027) para destaque.
- **Grayscale**: Imagens são P&B por padrão, ganhando cor ao passar o mouse.

---
**[http://localhost:5179/](http://localhost:5179/)**
