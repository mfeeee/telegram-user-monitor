# Telegram User Monitor

Monitora grupos do Telegram por palavras-chave e envia alertas via bot.

## Como funciona

O projeto usa duas conexões simultâneas ao Telegram:

- **Conta de usuário** (via TDLib/tdl) — entra nos grupos e escuta mensagens em tempo real
- **Bot** (via Telegraf) — recebe comandos e envia alertas para o seu chat pessoal

Quando uma mensagem em um grupo monitorado contém alguma das palavras-chave cadastradas, o bot te manda um alerta com o nome do grupo, o trecho da mensagem e quais palavras bateram.

## Pré-requisitos

- Node.js 18+
- Credenciais de API do Telegram (obtidas em [my.telegram.org](https://my.telegram.org))
- Um bot do Telegram criado via [@BotFather](https://t.me/BotFather)

## Instalação

```bash
git clone <url-do-repo>
cd telegram-user-monitor
npm install
```

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
API_ID=seu_api_id
API_HASH=seu_api_hash
PHONE_NUMBER=+55seunumerocomddd
BOT_TOKEN=token_do_seu_bot
```

## Uso

```bash
node index.js
```

Na primeira execução, o TDLib vai pedir o código de verificação enviado pelo Telegram para autenticar a conta de usuário. Após isso, a sessão fica salva em `_td_database/`.

### Configurar alertas via bot

Abra o bot no Telegram e envie `/start` — isso salva seu chat ID para receber os alertas.

### Comandos disponíveis

| Comando | Descrição |
|---|---|
| `/add <palavra>` | Adiciona uma keyword ao monitoramento |
| `/remove <palavra>` | Remove uma keyword |
| `/list` | Lista as keywords cadastradas |

Os grupos monitorados são gerenciados diretamente no `data.json` (gerado automaticamente na primeira execução).

## Estrutura

```
index.js          — ponto de entrada
bot.js            — bot Telegraf com os comandos
monitor.js        — listener de mensagens nos grupos
alertService.js   — formata e envia os alertas
chatService.js    — carrega os grupos monitorados
telegramClient.js — inicializa o cliente TDLib
storage.js        — leitura e escrita do data.json
config.js         — carrega variáveis de ambiente
```

## Observações

- `data.json` armazena o estado em tempo de execução (keywords, grupos, adminChatId) e não é versionado
- `_td_database/` contém a sessão autenticada da conta — nunca commite esse diretório
