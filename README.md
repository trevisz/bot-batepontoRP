
# ⏱️ Bot de bate ponto para RP

Este é um bot criado em **Node.js** com a biblioteca [discord.js](https://discord.js.org/), desenvolvido para registrar os turnos de patrulha de membros em servidores do Discord, especialmente útil em servidores de roleplay ou que prezam por organização de atividades.

## 🚨 Funcionalidades

- `!inicio`: Inicia o turno do usuário.
- `!fim`: Encerra o turno e calcula a duração.
- Armazena os dados em `data.json` com persistência.
- Mostra o total acumulado de tempo patrulhado.
- Presença dinâmica no Discord: `"👮 Monitorando patrulhas"`.

## 🛠️ Requisitos

- Node.js 18 ou superior
- Token de bot do Discord válido
- Permissões básicas de leitura e envio de mensagens

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/bot-dc.git
cd bot-dc
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o token sem gravá-lo no código. Defina `DISCORD_BOT_TOKEN` no ambiente do processo:

   **Windows PowerShell:**
   ```powershell
   $env:DISCORD_BOT_TOKEN = "<seu-token-do-bot>"
   ```

   **Linux/macOS:**
   ```bash
   export DISCORD_BOT_TOKEN="<seu-token-do-bot>"
   ```

   Nunca publique o token nem o salve em um arquivo versionado.

4. Inicie o bot:

```bash
node index.js
```

## 🧠 Estrutura

- `index.js`: Código principal do bot
- `data.json`: Base de dados local (persistência dos turnos)
- `discloud.config`: Arquivo de configuração para deploy na plataforma [Discloud](https://discloudbot.com/)

## ☁️ Deploy no Discloud

Este bot pode ser hospedado facilmente no Discloud. Basta enviar o projeto com `discloud upload`.

---

Desenvolvido com 💻 por trevisz  
