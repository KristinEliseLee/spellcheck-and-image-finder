
#Spellcheck and Image Finder
url : https://spellcheck-and-image-finder.herokuapp.com/

### To Use:
1. Install Node
2. Clone/fork/download files
3. Create a .env file with `AZURE_KEY='yourkeyhere'`
	(or otherwise set that environment variable)
4. run : `npm install`
5. run : `node server`


### To Build After Changes:
1. run : `npm run-script build`

### My Process:

This is my first Node.js project and my first project using Visual Studio 19.
I decided to try out a javascript backend instead of my usual Python.

This rudimentary spellcheck removes any non-letters, and then checks to see if the vowels were mis-typed.
For my spellcheck I used RegExp first to remove any non-letters, then after checking to see if it wasn't a valid word,
I created a Regexp from the original word, and used `String.match()` to find the first match in a Unix word list.

I decided to use Bing Image Search as there was a free tier, and a few tutorials, includng a Node.js tutorial.

I used React.js to deal with both the spellcheck and the AJAX of getting the search results.

I made a `/search` route so that I could keep my Azure API key secure on the backend.

