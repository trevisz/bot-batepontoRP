const fs = require('fs');
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const TOKEN = 'SEUTOKENAQ';
const dataFile = 'data.json';

function salvarDados(dados) {
    fs.writeFileSync(dataFile, JSON.stringify(dados, null, 2));
}

function carregarDados() {
    if (!fs.existsSync(dataFile)) return {};
    return JSON.parse(fs.readFileSync(dataFile));
}

client.once('ready', () => {
    console.log(`✅ Bot online como ${client.user.tag}`);

    setInterval(() => {
        client.user.setPresence({
            activities: [{
                name: '👮 Monitorando patrulhas',
                type: 'WATCHING'
            }],
            status: 'online'
        });
    }, 10000); // Atualiza a cada 10 segundos
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const userId = message.author.id;
    const dados = carregarDados();

    if (message.content === '!inicio') {
        if (dados[userId]?.inicio) {
            return message.reply('⏱️ Você já começou um turno! Use `!fim` para encerrar.');
        }
        if (!dados[userId]) dados[userId] = { total: 0 };

        dados[userId].inicio = Date.now();
        salvarDados(dados);
        return message.reply('<a:1GB_Verificado:1372192592489484368> Horario de patrulha iniciado!');
    }

    if (message.content === '!fim') {
        const inicio = dados[userId]?.inicio;
        if (!inicio) return message.reply('<a:1GB_Negado:1372192663918608425> Você ainda não usou `!inicio`.');

        const duracao = Date.now() - inicio;
        const horas = duracao / 3600000;

        dados[userId].total = (dados[userId].total || 0) + horas;
        delete dados[userId].inicio;

        salvarDados(dados);
        return message.reply(`<a:1GB_Verificado:1372192592489484368> Turno encerrado! Você trabalhou **${horas.toFixed(2)} horas**.`);
    }

    if (message.content === '!horas') {
        const total = dados[userId]?.total || 0;
        return message.reply(`🕒 Você acumulou **${total.toFixed(2)} horas**.`);
    }

    if (message.content === '!totalhoras') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('🚫 Apenas administradores podem usar este comando.');
        }

        if (Object.keys(dados).length === 0) {
            return message.reply('<a:1GB_Negado:1372192663918608425> Nenhum usuário registrou horas ainda.');
        }

        let relatorio = '📊 **Relatório de Horas:**\n\n';
        for (const id in dados) {
            const usuario = await message.guild.members.fetch(id).catch(() => null);
            const nome = usuario ? usuario.user.username : `Usuário (${id})`;
            const total = dados[id].total || 0;
            relatorio += `👤 **${nome}** — ${total.toFixed(2)} horas\n`;
        }

        return message.reply(relatorio);
    }

    if (message.content === '!reset') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('🚫 Apenas administradores podem usar este comando.');
        }
        salvarDados({});
        return message.reply('<a:1GB_Verificado:1372192592489484368> Todos os registros foram resetados.');
    }

        // !addhoras @user 2.5
    if (message.content.startsWith('!addhoras')) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('🚫 Apenas administradores podem usar esse comando.');
        }

        const partes = message.content.split(' ');
        const membro = message.mentions.members.first();
        const quantidade = parseFloat(partes[2]);

        if (!membro || isNaN(quantidade)) {
            return message.reply('<a:1GB_Negado:1372192663918608425> Use o formato: `!addhoras @usuário 1.5`');
        }

        const targetId = membro.user.id;
        if (!dados[targetId]) dados[targetId] = { total: 0 };

        dados[targetId].total += quantidade;
        salvarDados(dados);

        return message.reply(`<a:1GB_Verificado:1372192592489484368> Foram adicionadas **${quantidade} horas** para ${membro.user.username}.`);
    }

    
    if (message.content.startsWith('!remhoras')) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('🚫 Apenas administradores podem usar esse comando.');
        }

        const partes = message.content.split(' ');
        const membro = message.mentions.members.first();
        const quantidade = parseFloat(partes[2]);

        if (!membro || isNaN(quantidade)) {
            return message.reply('<a:1GB_Negado:1372192663918608425> Use o formato: `!remhoras @usuário 1.0`');
        }

        const targetId = membro.user.id;
        if (!dados[targetId]) dados[targetId] = { total: 0 };

        dados[targetId].total = Math.max(0, dados[targetId].total - quantidade);
        salvarDados(dados);

        return message.reply(`<a:1GB_Verificado:1372192592489484368> Foram removidas **${quantidade} horas** de ${membro.user.username}.`);
    }



});

client.login(TOKEN);

