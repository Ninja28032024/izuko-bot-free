const mega = require("megajs");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "mega",
    description: "Baixa arquivos do Mega.nz a partir de um link e envia como documento.",
    category: "downloads",
    execute: async ({ lux, msg, from, args, quoted, pushName }) => {
        if (args.length === 0) {
            return lux.sendMessage(from, { text: `Mestre ${pushName}, por favor, forneça um link do Mega.nz. Ex: !mega <link>` }, { quoted: msg });
        }

        const megaLink = args[0];

        if (!megaLink.includes("mega.nz")) {
            return lux.sendMessage(from, { text: `Mestre ${pushName}, o link fornecido não parece ser do Mega.nz. Por favor, verifique.` }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: `Mestre ${pushName}, estou concentrando meu chakra para buscar o arquivo do Mega.nz. Por favor, aguarde...` }, { quoted: msg });

        try {
            const file = mega.File.fromURL(megaLink);

            file.loadAttributes((err, file) => {
                if (err) {
                    console.error("Erro ao carregar atributos do arquivo Mega:", err);
                    return lux.sendMessage(from, { text: `❌ Mestre ${pushName}, um erro ocorreu ao carregar os detalhes do arquivo: ${err.message}` }, { quoted: msg });
                }

                const fileName = file.name;
                const tempFilePath = path.join("/tmp", fileName);
                const writer = fs.createWriteStream(tempFilePath);

                file.download().pipe(writer);

                writer.on("finish", async () => {
                    await lux.sendMessage(from, {
                        document: { url: tempFilePath },
                        fileName: fileName,
                        mimetype: "application/octet-stream" // Tipo MIME genérico, Mega.js não fornece facilmente
                    }, { quoted: msg });
                    fs.unlinkSync(tempFilePath); // Remove o arquivo temporário
                });

                writer.on("error", (writeErr) => {
                    console.error("Erro ao escrever o arquivo Mega:", writeErr);
                    lux.sendMessage(from, { text: `❌ Mestre ${pushName}, um erro ocorreu ao salvar o arquivo: ${writeErr.message}` }, { quoted: msg });
                    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
                });
            });

        } catch (error) {
            console.error("Erro ao baixar do Mega:", error);
            return lux.sendMessage(from, { text: `❌ Mestre ${pushName}, um erro inesperado ocorreu ao tentar baixar o arquivo do Mega: ${error.message}` }, { quoted: msg });
        }
    }
};
