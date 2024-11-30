# Projeto Team-Planner

Bem-vindo ao repositório do Team-Planner!

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente:

- **pnpm** - Um gerenciador de pacotes rápido e eficiente.
- **Docker** - Para containerização e fácil gerenciamento de dependências.

### Instalando o pnpm

Caso ainda não tenha o pnpm instalado, você pode instalá-lo globalmente usando o npm:

```bash
npm install -g pnpm
```

### Instalando o Docker

Para instalar o Docker, siga as instruções no site oficial do Docker para seu sistema operacional: [Docker Documentation](https://docs.docker.com/get-docker/).

## Instalando dependências

Recomendamos o uso do **pnpm** para gerenciar as dependências do projeto, pois ele é otimizado para melhor velocidade e uso de disco. No entanto, a instalação também funciona com npm.

```bash
pnpm install
```

## Configuração com Docker

Os arquivos necessários para a configuração do projeto estão localizados no projeto.

```bash
docker-compose up -d
```

## Scripts de Configuração

Antes de iniciar o projeto, é crucial executar o script de configuração de ambiente para definir as variáveis necessárias:

```bash
./setup.env.sh
```

## Populando o banco de dados

Após configurar o ambiente, você deve inicializar o banco de dados utilizando o comando de seed para popular o banco com dados de exemplo:    

```bash
pnpm run seed
```

## Execução do Projeto

Com todas as configurações em ordem, você pode iniciar o projeto com:

```bash
pnpm start
```

## Contribuição

Se você gostaria de contribuir para este projeto, sinta-se à vontade para abrir pull requests ou issues. Agradecemos por sua colaboração!

---

Esperamos que essas instruções sejam úteis para você iniciar e executar o Team-Planner. Se tiver alguma em contato conosco.