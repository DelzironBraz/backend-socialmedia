# Social Media Server

Para gerar uma chave secreta JWT, pode-se usar o comando a seguir:
```js
const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(64).toString('hex');
```