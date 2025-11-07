const fs = require('fs');
const path = require('path');

const antiImgConfigPath = path.join(__dirname, '..', 'banco de dados', 'antiimg_config.json');

const lerAntiImgConfig = () => {
    if (fs.existsSync(antiImgConfigPath)) {
        const data = fs.readFileSync(antiImgConfigPath, 'utf-8');
        return JSON.parse(data);
    }
    return { gruposAtivos: [] };
};

const salvarAntiImgConfig = (config) => {
    fs.writeFileSync(antiImgConfigPath, JSON.stringify(config, null, 2));
};

module.exports = {
    name: 'antiimg',
    description: 'Ativa ou desativa o sistema de anti-imagens em grupos.',
    async execute({ lux, msg, from, isGroup, sender, isOwner, settings, prefix }) {
        if (!isGroup) {
            return lux.sendMessage(from, { text: 'Mestre, este jutsu só pode ser invocado em grupos.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => p.id === sender)?.admin;

        if (!senderIsAdmin && !isOwner) {
            return lux.sendMessage(from, { text: 'Mestre, apenas administradores do grupo ou o Mestre principal podem invocar este jutsu.' }, { quoted: msg });
        }

        let config = lerAntiImgConfig();
        const index = config.gruposAtivos.indexOf(from);

        if (index > -1) {
            config.gruposAtivos.splice(index, 1);
            await lux.sendMessage(from, { text: 'Mestre, o jutsu Anti-Imagens foi *desativado* neste grupo. As imagens agora fluirão livremente.' }, { quoted: msg });
        } else {
            config.gruposAtivos.push(from);
            await lux.sendMessage(from, { text: 'Mestre, o jutsu Anti-Imagens foi *ativado* neste grupo. Cuidado com as imagens que quebram as regras!' }, { quoted: msg });
        }
        salvarAntiImgConfig(config);
    },
};
