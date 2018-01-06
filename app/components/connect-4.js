import Ember from 'ember';

export default Ember.Component.extend({
  playing: false,
  winner: undefined,
  draw: false,

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
    board.y = 40;
    board.alpha = 0;
    this.set('board', board);
    stage.addChild(board);

    var markers = {
      'b': [],
      'g': []
    }
    for(var x = 0; x < 22; x++){
      var blueMarker = new createjs.Shape();
      graphics = blueMarker.graphics;
      graphics.beginFill('blue');
      graphics.drawCircle(0, 0, 23);
      graphics.endFill();
      blueMarker.visible = false;
      stage.addChild(blueMarker);
      markers.b.push(blueMarker);

      var greenMarker = new createjs.Shape();
      graphics = greenMarker.graphics;
      graphics.beginFill('green');
      graphics.drawCircle(0, 0, 23);
      graphics.endFill();
      greenMarker.visible = false;
      stage.addChild(greenMarker);
      markers.g.push(greenMarker);
    }

    this.set('markers', markers);
    this.set('stage', stage);
    stage.addChild(board);
    createjs.Ticker.addEventListener("tick", stage);
  },

  click: function(ev) {
    if(this.get('playing') && !this.get('winner')){
      if(ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >= 20 && ev.offsetY >= 40 && ev.offsetX < 360 && ev.offsetY < 340) {
        // console.log(ev.offsetX);
        // console.log(ev.offsetY);
        var x = Math.floor((ev.offsetX - 20) / 48.5);
        var y = Math.floor((ev.offsetY - 40) / 50);
        var state = this.get('state');

        var y = 5;
        var state = this.get('state');

        console.log(state);
        while (state[x][y] == 'b' || state[x][y] == 'g'){
          y = y - 1;
        }


        // if(!state[x][y]) {
        if(y >= 0){
          var player = this.get('player');
          state[x][y] = player;

          var move_count = this.get('moves')[player];
          var marker = this.get('markers')[player][move_count];
          marker.visible = true;


          marker.x = 45 + x * 48.5;
          marker.y = 66 + y * 50;

          this.get('moves')[player] = move_count + 1;
          if(player == 'b'){
            this.set('player', 'g')
          } else {
            this.set('player', 'b');
          }
          this.get('stage').update();
        }
        this.check_winner();
      }
    }
  },

  check_winner: function() {
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

    //horizontal including 6th column aint working, fix.
  ];

  var state = this.get('state');
  for(var pidx = 0; pidx < patterns.length; pidx++) {
    var pattern = patterns[pidx];
    var winner = state[pattern[0][0]][pattern[0][1]];

    if(winner) {

      for(var idx = 1; idx < pattern.length; idx++) {

        if(winner != state[pattern[idx][0]][pattern[idx][1]]){
          winner = undefined;
          console.log(winner);
          break;
        }
      }
      if(winner){
        this.set('winner', winner);
        console.log(winner);
        break;

      }
    }
  }

  },

  actions: {
    start: function() {
      var board = this.get('board');
      board.alpha = 0;
      createjs.Tween.get(board).to({alpha: 1}, 1000);
      
      this.set('playing', true);
      this.set('winner', undefined);
      this.set('draw', false);
      this.set('state', [
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined]]);
        this.set('moves', {'b': 0, 'g': 0});
        this.set('player', 'g');
        var markers = this.get('markers');
        for(var idx = 0; idx < 22; idx++){
          markers.b[idx].visible = false;
          markers.g[idx].visible = false;
        }
        this.get('stage').update();
      }
    },




});
