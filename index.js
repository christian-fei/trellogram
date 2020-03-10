#!/usr/bin/env node
const trelloApi = require('./trello-api')
const chalk = require('chalk')
const yargs = require('yargs')

const key = process.env.npm_config_trello_api_key || process.env.TRELLO_API_KEY
const token = process.env.npm_config_trello_api_token || process.env.TRELLO_API_TOKEN

main(yargs.argv)
  .then(() => process.exit(0))
  .catch(err => console.error(err) && process.exit(1))

async function main ({ boardName = 'GTD', since, until, member } = {}) {
  const boards = await trelloApi.getBoards({ key, token })
  const board = boards.find(b => b.name.toLowerCase() === boardName.toLowerCase())
  if (!board) {
    console.log(`"${boardName}" not found,available boards`, boards.map(b => b.name).join(', '))
    throw new Error('no such board')
  }
  const boardId = board.id
  const boardLists = await trelloApi.getBoardLists({ key, token }, boardId)
  const boardMembers = await trelloApi.getBoardMembers({ key, token }, boardId)

  console.log(chalk.yellow('BOARD INFO'))
  console.log('name\t\t\t', board.name)
  console.log('id\t\t\t', board.id)
  console.log('dateLastActivity\t', board.dateLastActivity)
  console.log('shortUrl\t\t', board.shortUrl)
  console.log()

  if (since === 'today') since = todayStart()
  if (until === 'today') until = todayEnd()
  if (since === 'yesterday') since = yesterdayStart()
  if (until === 'yesterday') until = yesterdayEnd()

  console.log(`Looking for cards.. (${JSON.stringify({ boardName, since, until, member })})`)
  console.log()

  console.log(chalk.red('CARDS'))

  let todayCards = await trelloApi.getBoardCards({ key, token }, { boardId })

  todayCards = todayCards.map(c => Object.assign(c, {
    list: boardLists.find(l => l.id === c.idList),
    members: boardMembers.filter(m => c.idMembers.includes(m.id))
  }))
    .filter(c => {
      if (!since) return c
      const dateLastActivity = new Date(c.dateLastActivity)
      const filterSince = new Date(since)
      return dateLastActivity >= filterSince
    })
    .filter(c => {
      if (!until) return c
      const dateLastActivity = new Date(c.dateLastActivity)
      const filterUnilt = new Date(until)
      return dateLastActivity <= filterUnilt
    })
    .filter(c => {
      if (!member) return c
      return (c.members || []).find(m => m.username === member)
    })

  console.log(todayCards.map(cardToString).join('\n'))
}
function cardToString (c) {
  return [
    `${chalk.bold(c.name)}`,
    `\t${c.shortUrl}`,
    `\t${chalk.italic(`last activity ${c.dateLastActivity}`)}`
  ].join('\n')
}

function todayStart () {
  const t = new Date()
  t.setHours(0)
  t.setMinutes(0)
  t.setSeconds(0)
  return t
}
function todayEnd () {
  const t = new Date()
  t.setHours(23)
  t.setMinutes(59)
  t.setSeconds(59)
  return t
}
function yesterdayEnd () {
  const y = new Date()
  y.setDate(y.getDate() - 1)
  y.setHours(23)
  y.setMinutes(59)
  y.setSeconds(59)
  return y
}
function yesterdayStart () {
  const y = new Date()
  y.setDate(y.getDate() - 1)
  y.setHours(0)
  y.setMinutes(0)
  y.setSeconds(0)
  return y
}
