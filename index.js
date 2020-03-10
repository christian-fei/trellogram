#!/usr/bin/env node
const trelloQuery = require('./trello-query')
const chalk = require('chalk')
const argv = require('yargs')
  .option('board-name', {
    alias: 'b',
    type: 'string',
    description: 'trello board name (required)',
    required: true
  })
  .option('since', {
    alias: 's',
    type: 'string',
    description: 'filter cards since date (supports relative dates like today and yesterday)'
  })
  .option('until', {
    alias: 'u',
    type: 'string',
    description: 'filter cards until date (supports relative dates like today and yesterday)'
  })
  .option('member', {
    alias: 'm',
    type: 'string',
    description: 'filter cards by member username'
  })
  .option('key', {
    alias: 'k',
    type: 'string',
    description: 'Trello API Key'
  })
  .option('token', {
    alias: 't',
    type: 'string',
    description: 'Trello API Token'
  })
  .argv

main(argv)
  .then(() => process.exit(0))
  .catch(err => console.error(err) && process.exit(1))

async function main ({
  key = process.env.npm_config_trello_api_key || process.env.TRELLO_API_KEY,
  token = process.env.npm_config_trello_api_token || process.env.TRELLO_API_TOKEN,
  boardName = 'GTD',
  since,
  until,
  member
} = {}) {
  console.log(chalk.black('getting trello information..'))

  const { board, cards, members, lists } = await trelloQuery({ key, token, boardName, since, until, member })

  console.log(chalk.yellow('BOARD INFO'))
  console.log('name\t\t\t', board.name)
  console.log('id\t\t\t', board.id)
  console.log('dateLastActivity\t', board.dateLastActivity)
  console.log('shortUrl\t\t', board.shortUrl)
  console.log()

  console.log(`Looking for cards.. (${JSON.stringify({ boardName, since, until, member })})`)
  console.log()

  console.log(chalk.red('CARDS'))

  const output = cards.map(cardToString).join('\n')
  console.log(output)

  return { board, cards, members, lists, output }
}
function cardToString (c) {
  return [
    `${chalk.bold(c.name)}`,
    `\t${c.shortUrl}`,
    c.members.length > 0 && `\t${c.members.map(m => m.username).join(', ')}`,
    `\t${chalk.italic(c.dateLastActivity)}`,
    `\t${chalk.bgWhite.black(`${c.list.name}`)}`
  ].filter(Boolean).join('\n')
}
