const { serial: test } = require('ava')
const trelloQuery = require('./trello-query')
const nock = require('nock')

const key = 'test' || process.env.npm_config_trello_api_key || process.env.TRELLO_API_KEY
const token = 'test' || process.env.npm_config_trello_api_token || process.env.TRELLO_API_TOKEN

const baseTrelloApiUrl = 'https://api.trello.com'
const boardId = 1

test('query trello', async t => {
  nock(baseTrelloApiUrl)
    .get(`/1/members/me/boards?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test', id: 1 }])
  nock(baseTrelloApiUrl)
    .get(`/1/boards/${boardId}/lists?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test', id: 1 }])
  nock(baseTrelloApiUrl)
    .get(`/1/boards/${boardId}/members?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test', id: 1 }])
  nock(baseTrelloApiUrl)
    .get(`/1/boards/${boardId}/cards?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test', id: 1, idList: 1, idMembers: [1] }])

  const { board, members, lists, cards } = await trelloQuery({ key, token, boardName: 'test' })
  t.truthy(board)
  t.truthy(lists.length > 0)
  t.truthy(members.length > 0)
  t.truthy(cards.length > 0)
})
