# VM INOVART — Catálogo Online | Artes originais

Esta versão mantém **intactas** as artes comerciais completas que a VM INOVART forneceu. Cada arquivo PNG foi copiado byte a byte. A interface apenas o exibe; não há recortes, zoom, bordas sobre a arte, efeitos de cor ou textos sobrepostos.

## Conteúdo disponível

- CH001 Buda Dourado (`assets/produtos/CH001.png`)
- CH002 Raquete Bullpadel (`assets/produtos/CH002.png`)
- CH004 Coração Tricolor (`assets/produtos/CH004.png`)
- CH005 Anilha Tricolor (`assets/produtos/CH005.png`)

Seis cadastros anteriores permanecem no `data/produtos.js` como rascunhos com `publicar:false`, porque as respectivas artes originais ainda não foram anexadas para esta versão.

## Como adicionar produtos no mesmo padrão

1. Salve a arte **completa** produzida no Canva como PNG ou JPG, sem recortar.
2. Coloque-a em `assets/produtos/CODIGO.png` (ou extensão de origem).
3. Abra `editor-local.html`, preencha código, nome, categoria, subcategoria, descrição, preço, foto e habilite “Mostrar no catálogo”.
4. Clique `Baixar produtos.js atualizado` e substitua `data/produtos.js` no repositório do GitHub.
5. Adicione também a arte PNG/JPG original na pasta `assets/produtos/` do GitHub e confirme o resultado após a publicação.

## Hospedagem

Crie um repositório público `catalogo-vm-inovart` na conta `vminovaapp`, envie os arquivos da pasta-raiz e ative GitHub Pages em Settings > Pages > Deploy from a branch > main > /(root). A URL esperada será `https://vminovaapp.github.io/catalogo-vm-inovart/`. O site não está publicado só por existir este pacote.

O botão do WhatsApp informa código, nome, preço e, após publicação, URLs da própria imagem original e ficha do produto. A imagem é enviada como link, não como anexo automático.

## Nota

A versão prévia HTML permite testar tudo localmente, mas a URL da imagem só será incluída nas mensagens após publicação. O cadastro pelo editor local exige exportar o arquivo e enviar ao GitHub para atualizar a página.
