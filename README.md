# trellogram

trello board recap to your telegram.

for now it prints a recap in the terminal

## run

```bash
env TRELLO_API_KEY=XXX TRELLO_API_TOKEN=XXX npx trellogram --board-name "BOARD_NAME" --since yesterday --member MEMBER_NAME
```

## options

### --board-name

choose a board name

### --member

filter for cards assigned to a member

### --since

filter cards after a certain date

### --until

filter cards before a certain date