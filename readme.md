# API do Hiperdia
Funções criadas com node.js e express e implantadas no Firebase Functions.

## Como implantar
Garanta que na sua máquina contenha um arquivo .env.prod com as variáveis configuradas corretamentes. 
Se não estiver logado no firebase com o CLI, realize o login com 
```sh
firebase login
```

Execute os comandos:

```sh
firebase use prod
firebase deploy --only functions
```


