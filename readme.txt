I wrote this code last year, which was my second year in computer science engineering. 
This code is the backend of a personal a learning project I had in mind for an android application that lists news of japanese media and entertainment from different sources.
What would make the application different than others existing already lays in the way the news items are fetched and stored. Let's say that an RSS feed of a source only lists the recent 100 items. This means that if the user doesn't use the app for a week, let's say, and if in this period of time more than 100 items were listed in the RSS source, then the app would only list the 100 recent items and skip the ones before.
By writing a backend that fetches news items from different RSS sources every "T" period of time and stores them in a database, we could avoid this problem. We also avoid unnecessary loading time and unexpected exceptions than when having the front do everything (which is the case for other application.)


This is a barebone nodejs project that contains 3 endpoints : 
- GET /items: fetches news items from a certain timestamp given in the params from database. 
- POST & DELETE /words: unfinished. Saves and deletes keywords that would be used to filter news titles after fetching them from the database. This is one of the uncompleted features I wanted my application to have; filtering the user's news feed by custom words they chose.

On top of these endpoints, I added a feedListener module. This is the most important part of the app. the feed listener listens to different sources (MAL, ANN, Crunchyroll,) fetches new items and stores them in the database. It makes call the globalParser which also calls a module for each source to fetch their news items.

As I couldn't find which GitHub account I had my code stored, I pushed it into a new repository so there will be no commit history.
I have also placed a few screenshots of how the android app looks connected with the backend. The android application has most of the work done. I can send it as well if need be.
