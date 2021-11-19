![Chat Image](/chatImagem.png?raw=true "Chat Image")

# Chat MartTech

Este projeto foi criado como teste para uma vaga em Node.JS para a empresa MartTech.

É composto por uma API em Node.JS, que utiliza Websockets para trânsito de dados em janelas de chat.

Está também incluso um frontend em ReactJS apenas para validação do Websocket.

## Rodar localmente

Antes de iniciar o projeto é necessário que tenha o [NodeJS](https://nodejs.org) e o [Redis](https://redis.io) instalado na máquina, assim como um banco de dados se sua preferência (por padrão utilizado sqlite3, não sendo necessário instalação).

Clone o projeto

```bash
  git clone https://github.com/MechanicallyDev/MartTech-Teste-Chat
```

Abra a pasta do repositório

```bash
  cd MartTech-Teste-Chat
```

Acesse a pasta do backend

```bash
  cd backend
```

Instale as dependências de backend

```bash
  npm install
```

Crie um arquivo `.env` para armazenar as variáveis de ambiente, ou renomeie o arquivo `.env.example` para `.env`, e [configure as variáveis](#variáveis-de-ambiente) conforme o seu ambiente.

Faça as migrações de banco de dados para que o banco de dados seja criado.

```bash
  npx prisma migrate reset
```

Inicialize o serviço

```bash
  npm run dev
```

## Variáveis de ambiente

Antes de rodar este projeto você precisará adicionar as seguintes variáveis de ambiente ao seu arquivo `.env`.

* `APP_HOST= localhost` Endereço do host em que você está hospedando
* `APP_PORT= 3333` Porta que a aplicação vai monitorar

* `WS_PORT= 3344` Porta por onde transitarão os Websockets

* `REDIS_HOST= localhost` Host do banco de dados Redis
* `REDIS_PORT= 6379` Porta do banco de dados Redis

* `ACCESS_TOKEN_SECRET= 123456` Chave utilizada para encriptar o Access Token
* `ACCESS_TOKEN_EXPIRATION= '1m'` Tempo (em string) para o Access Token expirar

* `REFRESH_TOKEN_SECRET= 654321` Chave utilizada para encriptar o Refresh Token
* `REFRESH_TOKEN_EXPIRATION= 604800` Tempo (em segundos) para o Refresh Token expirar

* `VERIFICATION_TOKEN_SECRET= 987654` Chave utilizada para encriptar o Verification Token
* `VERIFICATION_TOKEN_EXPIRATION= 86400` Tempo (em segundos) para o Verification Token expirar

## Referência de API

##### [Usuários](#usuários)

* [Obter um usuário específico](#obter-um-usuário-específico)
* [Criar usuário](#criar-usuário)
* [Efetuar login](#efetuar-login)
* [Renovar tokens](#renovar-tokens)
* [Deslogar](#deslogar)

##### [Salas](#salas)

* [Listar salas](#listar-salas)
* [Criar nova sala](#criar-uma-nova-sala)
* [Renomear sala](#renomear-sala)

##### [Mensagens](#mensagens)

* [Obter mensagens em uma sala](#obter-mensagens-de-uma-sala)
* [Enviar um nova mensagem](#criar-uma-nova-mensagem)

### Usuários

#### Obter um usuário específico

```http
  GET /user/info/:id
```

##### Retorno

| Parâmetro     | Tipo     | Descrição                        |
| :--------     | :------- | :--------------------------------|
| `id`          | `number` | Identificador do usuário         |
| `email`       | `string` | E-mail do usuário                |
| `name`        | `string` | Nome do usuário                  |
| `createdAt`   | `string` | Data de criação da conta         |
| `updatedAt`   | `string` | Data da modificação mais recente |

#### Criar usuário

```http
  POST /user/register
```

| Parâmetro | Tipo     | Descrição                         |
| :-------- | :------- | :-------------------------        |
| `name` | `string` | **Obrigatório**. Nome do usuário  |
| `email` | `string` | **Obrigatório**. Email do usuário |
| `password`| `string` | **Obrigatório**. Senha            |

**Importante:** Ao criar o usuário, será lançado no console um link para verificação, simulando um serviço de verificação por e-mail.

Apenas após verificar através do link o usuário poderá fazer login e utilizar os tokens de autenticação.

#### Efetuar Login

```http
  POST /user/login
```

| Parâmetro | Tipo     | Descrição                         |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário |
| `password`| `string` | **Obrigatório**. Senha            |

##### Retorno

| Parâmetro     | Tipo     | Descrição                                          |
| :--------     | :------- | :--------------------------------                  |
| `accessToken` | `string` | Chave de acesso com curta duração                  |
| `refreshToken`| `string` | Chave para renovação da chave de acesso, uso único |

#### Renovar Tokens

```http
  POST /user/token
```

| Parâmetro | Tipo     | Descrição                         |
| :-------- | :------- | :-------------------------------- |
| `token` | `string` | **Obrigatório**. Refresh Token    |

##### Retorno

| Parâmetro     | Tipo     | Descrição                                                  |
| :--------     | :------- | :--------------------------------                          |
| `accessToken` | `string` | Chave de acesso com curta duração                          |
| `newRefreshToken`| `string` | Nova chave para renovação da chave de acesso, uso único |

#### Deslogar

```http
  DELETE /user/logout
```

| Parâmetro | Tipo     | Descrição                         |
| :-------- | :------- | :-------------------------------- |
| `token` | `string` | **Obrigatório**. Refresh Token    |

Após o logout os tokens de acesso são revogados e para obter novos tokens é necessário efetuar o login novamente.

### Salas

#### Listar salas

```http
  GET /chat/list
```

##### Retorno

A rota retorna um array de salas, cada item do array contendo:

| Parâmetro     | Tipo     | Descrição                          |
| :--------     | :------- | :--------------------------------  |
| `id`          | `number` | Identificador da sala              |
| `name`        | `string` | Nome da sala                       |
| `slug`        | `string` | Nome para acesso à sala            |
| `createdAt`   | `string` | Data de criação da sala            |
| `updatedAt`   | `string` | Data da modificação mais recente   |
| `ownerId`     | `number` | Identificador de quem criou a sala |

#### Criar uma nova sala

```http
  POST /chat/new
```

| Parâmetro | Tipo     | Descrição                                |
| :-------- | :------- | :-------------------------               |
| `name` | `string` | **Obrigatório**. Nome da sala            |
| `token` | `string` | **Obrigatório**. Access Token do usuário |

#### Renomear Sala

```http
  PUT /chat/rename/:slug
```

**Nota:** Apenas o criador da sala pode renomea-la.

| Parâmetro | Tipo     | Descrição                                |
| :-------- | :------- | :--------------------------------        |
| `email` | `string` | **Obrigatório**. Email do usuário        |
| `token` | `string` | **Obrigatório**. Access Token do usuário |

### Mensagens

#### Obter mensagens de uma sala

```http
  GET /chat/messages/:slug
```

| Parâmetro | Tipo     | Descrição                                |
| :-------- | :------- | :--------------------------------        |
| `slug`    | `string` | **Obrigatório**. Slug da sala            |

##### Retorno

A rota retorna um array de mensagens, cada item do array contendo:

| Parâmetro     | Tipo     | Descrição                          |
| :--------     | :------- | :--------------------------------  |
| `id`          | `number` | Identificador da mensagem          |
| `text`        | `string` | Texto da mensagem            |
| `roomId`      | `string` | Identificador da sala para quem a mensagem foi enviada |
| `userId`      | `string` | Identificador de quem enviou a mensagem |
| `createdAt`   | `string` | Data de envio da mensagem            |
| `user`        | `object` | Identificador de quem criou a sala |

O objeto `user` contém:

| Parâmetro     | Tipo     | Descrição                          |
| :--------     | :------- | :--------------------------------  |
| `id`          | `number` | Identificador do usuário           |
| `name`        | `string` | Nome do usuário                    |
| `email`       | `string` | E-mail do usuário                  |

#### Enviar uma nova mensagem

```http
  POST /chat/messages
```

| Parâmetro | Tipo     | Descrição                                |
| :-------- | :------- | :-------------------------               |
| `room`    | `string` | **Obrigatório**. Nome da sala para a qual vai enviar a mensagem |
| `text`    | `string` | **Obrigatório**. Texto da mensagem       |
| `token` | `string` | **Obrigatório**. Access Token do usuário |
