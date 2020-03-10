# trellogram

trello board recap to your telegram.

for now it prints a recap in the terminal

## run

```bash
env TRELLO_API_KEY=XXX TRELLO_API_TOKEN=XXX npx trellogram --board-name "BOARD_NAME" --since yesterday --member MEMBER_NAME
```

## output

```
> trellogram --board-name "GTD" --since yesterday

getting trello information..
"GTD" found: loading members, lists and cards..
BOARD INFO
name			 GTD
id			 XXX
dateLastActivity	 2020-03-10T07:33:03.966Z
shortUrl		 https://trello.com/b/XXXXXX

Looking for cards.. ({"boardName":"GTD","since":"yesterday"})

CARDS
mega-scraper blogpost
	https://trello.com/c/XXXXXX
	2020-03-09T08:31:12.774Z
	DONE
browserless crawling a website blogpost
	https://trello.com/c/XXXXXX
	2020-03-10T07:03:47.413Z
	DONE
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