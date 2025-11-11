# Odontograma Assets

Coloque aqui as imagens dos dentes e a imagem base do odontograma.

## Estrutura recomendada
```
public/odontograma/
  README.md
  odontograma-base.png              (imagem de fundo geral)
  dentes/
    tooth-11.png
    tooth-12.png
    ...
    tooth-18.png
    tooth-21.png
    ...
    tooth-28.png
    tooth-31.png
    ...
    tooth-38.png
    tooth-41.png
    ...
    tooth-48.png
```

Use o padrão FDI para nomear (11–18, 21–28, 31–38, 41–48). As imagens devem ser recortadas com fundo transparente.

Tamanho sugerido por dente: 60–90px de largura. A imagem base pode ter 1200x600 ou proporção similar.

## Passos no Windows para adicionar
1. Abra o Explorer.
2. Navegue até esta pasta.
3. Arraste seus arquivos PNG para `dentes/`.
4. Salve.
5. Recarregue o navegador (Ctrl+Shift+R) para forçar o Vite a servir os novos assets.

## Troubleshooting
- Se aparecer só o número do dente, o arquivo não foi encontrado.
- Caminho testável direto: `http://localhost:5174/odontograma/dentes/tooth-11.png`
- Verifique se o nome é exatamente em minúsculas e sem espaços.

## Próximos
- Adicionar dentes decíduos (51–55, 61–65, 71–75, 81–85) se necessário.
- Gerar snapshot do odontograma para inserir nos PDFs.
