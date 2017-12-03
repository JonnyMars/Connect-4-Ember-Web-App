import Ember from 'ember';

  function deepClone(state) {
    var new_state = [];
    for(var idx1 = 0; idx1 < state.length; idx1++) {
      new_state.push(state[idx1].slice(0));
    }
    return new_state;
  }

  function check_game_winner(state) {
    var patterns = [
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
    ];
    for(var pidx = 0; pidx < patterns.length; pidx++) {
      var pattern = patterns[pidx];
      var winner = state[pattern[0][0]][pattern[0][1]];
      if(winner) {
        for(var idx = 1; idx < pattern.length; idx++) {
          if(winner != state[pattern[idx][0]][pattern[idx][1]]) {
            winner = undefined;
            break;
          }
        }
        if(winner) {
          return winner;
        }
      }
    }
      var draw = true;
      for(var x = 0; x <= 2; x++) {
        for(var y = 0; y <= 2; y++){
          if(!state[x][y]) {
            return undefined;
          }
        }
      }
      return '';
  }

  var patterns = [
    {
        pattern: [['p', 0, 1], ['p', 0, 1], ['p']],
        score: 1000
    },
    {
        pattern: [['p', 1, 0], ['p', 1, 0], ['p']],
        score: 1000
    },
    {
        pattern: [['p', 1, 1], ['p', 1, 1], ['p']],
        score: 1000
    },
    {
        pattern: [['p', 1, -1], ['p', 1, -1], ['p']],
        score: 1000
    },
    {
        pattern: [['p', 0, 1], ['p']],
        score: 50
    },
    {
        pattern: [['p', 1, 0], ['p']],
        score: 50
    },
    {
        pattern: [['p', 1, 1], ['p']],
        score: 50
    },
    {
        pattern: [['p', 1, -1], ['p']],
        score: 50
    },
];

  function match_pattern_at(state, pattern, player, x, y) {
    if(x >= 0 && x < state.length) {
        if(y >= 0 && y < state[x].length) {
        var element = pattern[0];
            if(element[0] == 'p') {
            if(state[x][y] !== player) {
                    return false;
                }
              } else if(element[0] == ' ') {
                 if(state[x][y] !== undefined) {
                     return false;
                 }
             }
             if(pattern.length > 1) {
                 return match_pattern_at(state, pattern.slice(1), player, x + element[1], y + element[2])
             } else {
                 return true;
             }
         }
     }
     return false;
 }

  function match_pattern(state, pattern, player){
    for(var idx1 = 0; idx1 < state.length; idx1++){
      for(var idx2 = 0; idx2 < state[idx1].length; idx2++){
        var matches = match_pattern_at(state, pattern, player, idx1, idx2);
        if(matches) {
          return true;
        }
      }
    }
    return false;
  }

  function heuristic(state){
    var score = 0;
    for(var idx = 0; idx < patterns.length; idx++){
      if(match_pattern(state, patterns[idx].pattern, 'o')) {
        score = score + patterns[idx].score;
      }
      if(match_pattern(state, patterns[idx].pattern, 'x')) {
        score = score - patterns[idx].score;
      }
    }
    return score;
  }

  function minimax(state, limit, player) {
    var moves = []
     if(limit > 0) {
        for(var idx1 = 0; idx1 < 3; idx1++) {
        for(var idx2 = 0; idx2 < 3; idx2++) {
            if(state[idx1][idx2] === undefined) {
                     var move = {
                        x: idx1,
                         y: idx2,
                       state: deepClone(state),
                         score: 0
                     };
                    move.state[idx1][idx2] = player;
                    if(limit === 1 || check_game_winner(move.state) !== undefined) {
                      move.score = heuristic(move.state);
                     } else {
                       move.moves = minimax(move.state, limit - 1, player == 'x' ? 'o' : 'x');
                       var score = undefined;
                       for(var idx3 = 0; idx3 < move.moves.length; idx3++) {
                           if(score === undefined) {
                               score = move.moves[idx3].score;
                           } else if(player === 'x') {
                               score = Math.max(score, move.moves[idx3].score);
                           } else if(player === 'o') {
                               score = Math.min(score, move.moves[idx3].score);
                           }
                                       }
                     move.score = score;
                 }
                     moves.push(move);
                }
             }
         }
     }
     return moves;
  }

  function computer_move(state) {
    var moves = minimax(state, 4, 'o');
    var max_score = undefined;
    var move = undefined;
    for(var idx = 0; idx < moves.length; idx++){
      if(max_score === undefined || moves[idx].score > max_score) {
        max_score = moves[idx].score;
        move = {
          x: moves[idx].x,
          y: moves[idx].y
        }
      }
    }
    return move;
  }

export default Ember.Component.extend({
  playing: false,
  winner: undefined,
  draw: false,

  init: function() {
    this._super(...arguments);
    createjs.Sound.registerSound("assets/sounds/click.wav", "place-marker");
    createjs.Sound.registerSound("assets/sounds/falling.mp3", "falling");
    createjs.Sound.registerSound("assets/sounds/winner.wav", "winner");
  },

  didInsertElement: function() {
    var stage = new createjs.Stage(this.$('#stage')[0]);

    //draw the game board
    var board = new createjs.Shape();
    var graphics = board.graphics;
    graphics.beginFill('#ffffff');
    graphics.drawRect(0, 99, 300, 2);
    graphics.drawRect(0, 199, 300, 2);
    graphics.drawRect(99, 0, 2, 300);
    graphics.drawRect(199, 0, 2, 300);

    //Check Box pattern

    graphics.drawRect(0, 0, 100, 100);
    graphics.drawRect(0, 200, 100, 100);
    graphics.drawRect(100, 100, 100, 100);
    graphics.drawRect(200, 200, 100, 100);
    graphics.drawRect(200, 0, 100, 100);

    //end white fill
    graphics.endFill();
    board.x = 40;
    board.y = 40;
    board.alpha = 0;
    this.set('board', board);
    stage.addChild(board);

    var markers = {
      'x' : [],
      'o' : []
    }

    for (var x = 0; x < 5; x++) {
      var circleMarker = new createjs.Shape();
      graphics = circleMarker.graphics;
      graphics.beginStroke('#66ff66');
      graphics.setStrokeStyle(10);
      graphics.drawCircle(0, 0, 30);
      circleMarker.visible = false;
      stage.addChild(circleMarker);
      markers.o.push(circleMarker);

      var crossMarker = new createjs.Shape();
      graphics = crossMarker.graphics;
      graphics.beginStroke('#6666ff');
      graphics.setStrokeStyle(10);
      graphics.moveTo(0, 0);
      graphics.lineTo(40, 40);
      graphics.moveTo(0, 40);
      graphics.lineTo(40, 0);
      crossMarker.visible = false;
      stage.addChild(crossMarker);
      markers.x.push(crossMarker);
    }

    this.set('markers', markers);
    this.set('stage', stage);

    //update the drawing
    createjs.Ticker.addEventListener("tick", stage);
  },

  click: function(ev) {
    var component = this;
    if(component.get('playing') && !component.get('winner')){
      if(ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >=40 && ev.offsetY >=40 && ev.offsetX < 340 && ev.offsetY < 340) {
        var x = Math.floor((ev.offsetX - 40) / 100);
        var y = Math.floor((ev.offsetY - 40) / 100);
        var state = component.get('state');
        if(!state[x][y]) {
          createjs.Sound.play("place-marker");
          state[x][y] = 'x';

          var move_count = component.get('moves')['x'];
          var marker = component.get('markers')['x'][move_count];
          marker.visible = true;
          marker.x = 70 + x * 100;
          marker.y = 70 + y * 100;
          component.check_winner();
          component.get('moves')['x'] = move_count + 1;

          setTimeout(function() {
            if(!component.get('winner') && !component.get('draw')) {
              var move = computer_move(state);
              move_count = component.get('moves')['o'];
              state[move.x][move.y] = 'o';
              marker = component.get('markers')['o'][move_count];
              marker.visible = true;
              marker.x = 90 + move.x * 100;
              marker.y = 90 + move.y * 100;
              component.get('moves')['o'] = move_count + 1;
              component.get('stage').update();
              component.check_winner();
            }
          }, 500);
        }
      }
    }
  },

  check_winner: function() {
    var state = this.get('state');
    var winner = check_game_winner(state);
    if(winner !== undefined) {
      if(winner === '') {
        this.set('draw', true);
      } else {
        this.set('winner', winner);
        createjs.Sound.play("winner");
      }
    }
  },

  actions: {
    start: function() {
      var board = this.get('board');
      board.alpha = 0;
      if(this.get('playing')) {
        var markers = this.get('markers');
        for(var idx = 0; idx < 5; idx++) {
          createjs.Tween.get(markers.x[idx]).to({y: 600}, 500);
          createjs.Tween.get(markers.o[idx]).to({y: 600}, 500);
        }
        createjs.Sound.play("falling");
        createjs.Tween.get(board).wait(500).to({alpha: 1}, 1000);
      } else {
        createjs.Tween.get(board).to({alpha: 1}, 1000);
      }
      this.set('playing', true);
      this.set('winner', undefined);
      this.set('draw', undefined);
      this.set('draw', false);
      this.set('state', [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]]);
      this.set('moves', {'x': 0, 'o': 0});
      this.set('player', 'x');
      var markers = this.get('markers');
    }
  }
});
