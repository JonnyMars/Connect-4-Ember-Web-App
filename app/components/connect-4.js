import Ember from 'ember';

export default Ember.Component.extend({
  playing: false, //playing set to false as default, changed once the player presses/clicks Start.
  winner: undefined, //Winner variable to be changed once someone wins the game.
  draw: false, //draw variable is set to false by default, due to the game not being complete.

  didInsertElement: function() {
    var stage = new createjs.Stage(this.$('#stage')[0])

    // Draw the game board
    var board = new createjs.Shape();
    var graphics = board.graphics;
    graphics.beginFill('#ffffff');

    //Draw outer box
    graphics.drawRect(0, 0, 340, 2);
    graphics.drawRect(340, 0, 2, 300);
    graphics.drawRect(0, 0, 2, 300);
    graphics.drawRect(0, 300, 340, 2);

    //Draw Vertical Grid
    graphics.drawRect(48.5, 0, 2, 300);
    graphics.drawRect(97, 0, 2, 300);
    graphics.drawRect(145.5, 0, 2, 300);
    graphics.drawRect(194, 0, 2, 300);
    graphics.drawRect(242.5, 0, 2, 300);
    graphics.drawRect(291, 0, 2, 300);

    //Draw Horizontal Grid
    graphics.drawRect(0, 50, 340, 2);
    graphics.drawRect(0, 100, 340, 2);
    graphics.drawRect(0, 150, 340, 2);
    graphics.drawRect(0, 200, 340, 2);
    graphics.drawRect(0, 250, 340, 2);



    board.x = 20;
    board.y = 40
    //board alpha = 0 makes the board transparrent. When game loads the board will not be visible.
    board.alpha = 0;
    this.set('board', board);
    stage.addChild(board);

    //create variable for markers... B for Blue, G for Green.
    var markers = {
      'b': [],
      'g': []
    }
    //create 22 markers for each player (7 x 6 = 42)
    for(var x = 0; x < 22; x++){
      //create blue circle marker with radius of 23.
      var blueMarker = new createjs.Shape();
      graphics = blueMarker.graphics;
      graphics.beginFill('blue');
      graphics.drawCircle(0, 0, 23);
      graphics.endFill();
      blueMarker.visible = false; //hide marker as default until played.
      stage.addChild(blueMarker);
      markers.b.push(blueMarker);
      //create green circle marker with radius of 23.
      var greenMarker = new createjs.Shape();
      graphics = greenMarker.graphics;
      graphics.beginFill('green');
      graphics.drawCircle(0, 0, 23);
      graphics.endFill();
      greenMarker.visible = false; //hide marker as default until played.
      stage.addChild(greenMarker);
      markers.g.push(greenMarker);
    }

    this.set('markers', markers);
    this.set('stage', stage);
    stage.addChild(board);
    createjs.Ticker.addEventListener("tick", stage);
  },

  click: function(ev) {
    //if the game has been started and there is no winner yet do this.
    if(this.get('playing') && !this.get('winner')){
      //The board starts at 20/40 pixels and is 360px wide and 340px tall. Clicks will only be handled if clicked inside these parameters.
      if(ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >= 20 && ev.offsetY >= 40 && ev.offsetX < 360 && ev.offsetY < 340) {
        // console.log(ev.offsetX);
        // console.log(ev.offsetY);

        //as the board started 20 pixels across, the 20 pixels have to be subtracted. Dividing by 48.5 calculates the value of each column, as each column is 48.5px tall.
        var x = Math.floor((ev.offsetX - 20) / 48.5);
        //as the board started 40 pixels dpwn, the 40 pixels have to be subtracted. Dividing by 50 calculates the value of each column, as each row is 50px wide.
        var y = Math.floor((ev.offsetY - 40) / 50);
        var state = this.get('state');


        //Var y value of 5.
        var y = 5;
        var state = this.get('state');
        //console.log(state);

        //each time marker is placed, subrtact 1 from the Y variable relevant to the column it is placed in.
        while (state[x][y] == 'b' || state[x][y] == 'g'){
          y = y - 1;
          //console.log(y);
        }


        //if the column is not full (y variable bigger than or equal to one. The column will be blocked if variable reaches -1.), do this.
        if(y >= 0){
          //as marker is placed, play 'place-marker' sound
          createjs.Sound.play('place-marker');
          var player = this.get('player');
          state[x][y] = player;

          var move_count = this.get('moves')[player];
          var marker = this.get('markers')[player][move_count];
          marker.visible = true;

          //where to place marker.
          marker.x = 45 + x * 48.5;
          marker.y = 66 + y * 50;

          this.get('moves')[player] = move_count + 1;
          //as each plaer has a go, change which player's go it is.
          if(player == 'b'){
            this.set('player', 'g')
          } else {
            this.set('player', 'b');
          }
          this.get('stage').update();
        }
        //check if any of the patterns outlined in the 'check_winner' function match the current game state.
        this.check_winner();
      }
    }
  },

  check_winner: function() {
    //outline patterns of a win.
    var patterns = [

    //1st column vertical
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 1], [0, 2], [0, 3], [0, 4]],
    [[0, 2], [0, 3], [0, 4], [0, 5]],
    //2nd column vertical
    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[1, 1], [1, 2], [1, 3], [1, 4]],
    [[1, 2], [1, 3], [1, 4], [1, 5]],
    //3rd column vertical
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[2, 1], [2, 2], [2, 3], [2, 4]],
    [[2, 2], [2, 3], [2, 4], [2, 5]],
    //4th column vertical
    [[3, 0], [3, 1], [3, 2], [3, 3]],
    [[3, 1], [3, 2], [3, 3], [3, 4]],
    [[3, 2], [3, 3], [3, 4], [3, 5]],
    //5th column  vertical
    [[4, 0], [4, 1], [4, 2], [4, 3]],
    [[4, 1], [4, 2], [4, 3], [4, 4]],
    [[4, 2], [4, 3], [4, 4], [4, 5]],
    //6th column  vertical
    [[5, 0], [5, 1], [5, 2], [5, 3]],
    [[5, 1], [5, 2], [5, 3], [5, 4]],
    [[5, 2], [5, 3], [5, 4], [5, 5]],
    //7th column  vertical
    [[6, 0], [6, 1], [6, 2], [6, 3]],
    [[6, 1], [6, 2], [6, 3], [6, 4]],
    [[6, 2], [6, 3], [6, 4], [6, 5]],

    //1st column  Horizontal
    [[0, 5], [1, 5], [2, 5], [3, 5]],
    [[1, 5], [2, 5], [3, 5], [4, 5]],
    [[2, 5], [3, 5], [4, 5], [5, 5]],
    [[3, 5], [4, 5], [5, 5], [6, 5]],
    //2nd column  Horizontal
    [[0, 4], [1, 4], [2, 4], [3, 4]],
    [[1, 4], [2, 4], [3, 4], [4, 4]],
    [[2, 4], [3, 4], [4, 4], [5, 4]],
    [[3, 4], [4, 4], [5, 4], [6, 4]],
    //3rd column  Horizontal
    [[0, 3], [1, 3], [2, 3], [3, 3]],
    [[1, 3], [2, 3], [3, 3], [4, 3]],
    [[2, 3], [3, 3], [4, 3], [5, 3]],
    [[3, 3], [4, 3], [5, 3], [6, 3]],
    //4th column  Horizontal
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 2], [2, 2], [3, 2], [4, 2]],
    [[2, 2], [3, 2], [4, 2], [5, 2]],
    [[3, 2], [4, 2], [5, 2], [6, 2]],
    //5th column  Horizontal
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[1, 1], [2, 1], [3, 1], [4, 1]],
    [[2, 1], [3, 1], [4, 1], [5, 1]],
    [[3, 1], [4, 1], [5, 1], [6, 1]],
    //6th column  Horizontal
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[1, 0], [2, 0], [3, 0], [4, 0]],
    [[2, 0], [3, 0], [4, 0], [5, 0]],
    [[3, 0], [4, 0], [5, 0], [6, 0]],

    //Diagonals (Left to Right)
    [[3, 0], [2, 1], [1, 2], [0, 3]],  //work
    [[4, 0], [3, 1], [2, 2], [1, 3]],  //work
    [[3, 1], [2, 2], [1, 3], [0, 4]],  //work
    [[5, 0], [4, 1], [3, 2], [2, 3]],  //work
    [[4, 1], [3, 2], [2, 3], [1, 4]],  //work
    [[3, 2], [2, 3], [1, 4], [0, 5]],  //work
    [[5, 1], [4, 2], [3, 3], [2, 4]],  //work
    [[4, 2], [3, 3], [2, 4], [1, 5]],  //work
    [[3, 3], [4, 2], [5, 1], [6, 0]],  //Work
    [[5, 2], [4, 3], [3, 4], [2, 5]],  //work
    [[3, 4], [4, 3], [5, 2], [6, 1]],  //work
    [[3, 5], [4, 4], [5, 3], [6, 2]],  //work


    //Diagonals (Right to Left)
    [[6, 3], [5, 2], [4, 1], [3, 0]],  //work
    [[6, 4], [5, 3], [4, 2], [3, 1]],  //work
    [[5, 3], [4, 2], [3, 1], [2, 0]],  //work
    [[5, 3], [4, 2], [3, 1], [2, 0]],  //work
    [[6, 5], [5, 4], [4, 3], [3, 2]],  //work
    [[5, 4], [4, 3], [3, 2], [2, 1]],  //work
    [[4, 3], [3, 2], [2, 1], [1, 0]],  //work
    [[5, 5], [4, 4], [3, 3], [2, 2]],  //work
    [[4, 4], [3, 3], [2, 2], [1, 1]],  //work
    [[3, 3], [2, 2], [1, 1], [0, 0]],  //work
    [[4, 5], [3, 4], [2, 3], [1, 2]],  //work
    [[3, 4], [2, 3], [1, 2], [0, 1]],  //work
    [[3, 5], [2, 4], [1, 3], [0, 2]],  //work
  ];

  var state = this.get('state');

  for(var pidx = 0; pidx < patterns.length; pidx++) {
    var pattern = patterns[pidx];
    var winner = state[pattern[0][0]][pattern[0][1]];

    if(winner) {
      //loop over all co-ordinates starting at idx 1
      for(var idx = 1; idx < pattern.length; idx++) {

        if(winner != state[pattern[idx][0]][pattern[idx][1]]){
          winner = undefined;
          console.log(winner);
          break;
        }
      }
      //identify winner and set B or G to 'winner'.
      if(winner){
        this.set('winner', winner);
        console.log(winner);
        //play winner sound.
        createjs.Sound.play('winner');
        break;

      }
    }
  }

  //if no winner, check this to see if it is a draw.
  if(!this.get('winner')) {
    var draw = true;
    for(var x = 0; x <= 6; x++) {
      for(var y = 0; y <= 5; y++) {
        if(!state[x][y]){
          draw = false;
          break;
        }
      }
    }
    this.set('draw', draw);
  }
  },

  actions: {
    start: function() {
      //toast plugin for cordova mobile app. Pop up message.
      if(window.plugins && window.plugins.toast){
        window.plugins.toast.showShortBottom('Green to play First.');
      }

      var board = this.get('board');
      board.alpha = 0; //If game is restarted, this will make the board fade out back to being transparrent.
      if(this.get('playing')) {
        var markers = this.get('markers');
        for(var idx = 0; idx < 22; idx++){
          createjs.Tween.get(markers.g[idx]).to({y: 600}, 500); //when game restarts, move all of the markers out of visible area (y: 600) with an animation time of 500ms.
          createjs.Tween.get(markers.b[idx]).to({y: 600}, 500);
        }
        createjs.Sound.play('falling'); //play falling sound effect to match the animations.
        createjs.Tween.get(board).wait(500).to({alpha: 1}, 1000); //make board visible within 1 second (fade).
      } else {
        createjs.Tween.get(board).to({alpha: 1}, 1000); //make board visible within 1 second (fade).
      }


      this.set('playing', true); //Once the user clicks start, this function will be used to change the 'playing' variable to 'true'
      this.set('winner', undefined); //Winner is undefined at the start of the game.
      this.set('draw', false);
      //current state of the game upon start. Undefined indicates that no player has played in that slot yet.
      this.set('state', [
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined]]);
        //Reset number of moves each user has had to 0 upon start of game/restart.
        this.set('moves', {'b': 0, 'g': 0});
        //Starting player is Green.
        this.set('player', 'g');
        var markers = this.get('markers');

        //redraw the stage.
        this.get('stage').update();
      }
    },

    //initialise/load all of the sounds and assign names/tags to each.
    init: function() {
      this._super(...arguments);
      createjs.Sound.registerSound('assets/sounds/click.wav', 'place-marker');
      createjs.Sound.registerSound('assets/sounds/falling.mp3', 'falling');
      createjs.Sound.registerSound('assets/sounds/win.wav', 'winner');
    },




});
