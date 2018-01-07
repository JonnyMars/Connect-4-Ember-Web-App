import Ember from 'ember';

export default Ember.Component.extend({
  playing: false,
  correct: false,
  guesses: 0,
  guessValue: 0,
  limits: null,


  actions: {
      start: function() {
        this.set('playing', true);
        this.set('correct', false);
        this.set('guessValue', Math.floor(Math.random() * 100) + 1);
        this.set('guesses', 1);
        this.set('limits', {'min': 1, 'max': 100});
      },
      lower: function() {
        var limit = this.get('limits');
        limit.max = this.get('guessValue');
        this.set('guessValue', limit.min + Math.floor((limit.max - limit.min) / 2));
        this.set('guesses', this.get('guesses') + 1);
      },
      higher: function() {
        var limit = this.get('limits');
        limit.min = this.get('guessValue');
        this.set('guessValue', limit.min + Math.floor((limit.max - limit.min + 1) / 2));
        this.set('guesses', this.get('guesses') + 1);
      },
      correct: function() {
        this.set('correct', true);
      },
      'save-highscore': function() {
        var action = this.get('on-save-highscore');
        if (action !== undefined) {
          action(this.get('player_name'), this.get('guesses'));
        }
        }
  }
});
