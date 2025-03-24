<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

After launching the project you will have have a swagger page at: localhost:3000/api
Contains two endpoints:

1. /github/check-repo-access -> Checks if the given token grants access to given repo
2. /github/scan-repo -> Scans all the files in given repo with given token and looks for AWS SECRETS and returns true/false with list of found secrets

I didnt get to finish the implementation of scanning the actual commits but the idea is to look inside the commit messages and the diff files by looping through all the commits, not really complex since the scan-repo is already implemented and will be using a similar logic on scanning diff files and commit messages.
