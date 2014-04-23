# Sails.js + React.js Example

Inspired by the React.js Comment tutorial, this example shows a way to integrate Sails.js as the real time persistent backend model to a React.js frontend. The example provides a markdown chat application which automatically pushes comment updates to all connected clients.

#### References
* [Sails Tutorial](https://www.youtube.com/watch?v=uxojCaDSyZA)
* [React Tutorial](http://facebook.github.io/react/docs/tutorial.html)
* [React Animation](http://facebook.github.io/react/docs/animation.html)

## Run Instructions

```bash
git clone https://github.com/mixxen/sails-react-example.git
cd sails-react-example
npm install
node app.js
open http://localhost:1337
```

## Start from Scratch
1. Install Sails

   ```
   sudo npm -g install sails
   ```

2. Create new Sails project

   ```
   sails new sails-react-example --linker
   ```

3. Change directory to sails-react-example

4. Install grunt-react

   ```
   npm install grunt-react
   ```

4. Edit Gruntfile.js to support jsx files

5. Put these javascript libraries in the assets/linker/ folder:
   * Bootstrap
   * jQuery
   * React
   * Showdown
   * Timeago

6. Edit Gruntfile.js to include javascript libraries in the correct order

7. Create assets/linker/styles/styles.css for styles and animation css 

8. Create Comment model and controller

   ```
   sails generate comment
   ```
9. Edit views/home/index.ejs and put ```<div class="container" id="container"></div>``` somewhere

10. Rename assets/linker/js/app.js to assets/linker/js/app.jsx and start coding. Be sure to call ```renderCompoenent``` somewhere and reference the div in previous step. Example:

   ```javascript
   React.renderComponent(
     <CommentBox url="/comment" data={message} />,
     document.getElementById('container')
   );
   ```

## Todo

* Add passport authentication
* Add todo list example
