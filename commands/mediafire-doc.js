const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "mediafire-doc",
    aliases: ["mfd"],
    description: "Baixa arquivos do MediaFire a partir de um link e envia como documento.",
    category: "downloads",
    execute: async ({ lux, msg, from, args, quoted, pushName }) => {
        if (args.length === 0) {
            return lux.sendMessage(from, { text: `Mestre ${pushName}, por favor, forneça um link do MediaFire. Ex: !mediafire-doc <link>` }, { quoted: msg });
        }

        const mediafireLink = args[0];

        if (!mediafireLink.includes("mediafire.com")) {
            return lux.sendMessage(from, { text: `Mestre ${pushName}, o link fornecido não parece ser do MediaFire. Por favor, verifique.` }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: `Mestre ${pushName}, estou concentrando meu chakra para buscar o arquivo do MediaFire. Por favor, aguarde...` }, { quoted: msg });

        try {
            // Passo 1: Obter a página do MediaFire para extrair o link de download direto
            const pageResponse = await axios.get(mediafireLink);
            const $ = cheerio.load(pageResponse.data);
            const downloadLink = $("#downloadButton").attr("href");
            const fileName = $(".dl-btn-label").text().trim().split("(")[0].trim(); // Extrai o nome do arquivo sem o tamanho

            if (!downloadLink) {
                return lux.sendMessage(from, { text: `❌ Mestre ${pushName}, não consegui encontrar o link de download direto nesta página do MediaFire.` }, { quoted: msg });
            }

            const tempFilePath = path.join("/tmp", fileName || "mediafire_file.bin");
            const writer = fs.createWriteStream(tempFilePath);

            // Passo 2: Baixar o arquivo em streaming
            const fileResponse = await axios({
                method: "get",
                url: downloadLink,
                responseType: "stream"
            });

            fileResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            // Passo 3: Enviar o arquivo após o download completo
            await lux.sendMessage(from, {
                document: { url: tempFilePath },
                fileName: fileName || "mediafire_file.bin",
                mimetype: fileResponse.headers["content-type"] || "application/octet-stream"
            }, { quoted: msg });

            fs.unlinkSync(tempFilePath); // Remove o arquivo temporário após o envio

        } catch (error) {
            console.error("Erro ao baixar do MediaFire:", error);
            return lux.sendMessage(from, { text: `❌ Mestre ${pushName}, um erro inesperado ocorreu ao tentar baixar o arquivo do MediaFire: ${error.message}` }, { quoted: msg });
        }
    }
};
