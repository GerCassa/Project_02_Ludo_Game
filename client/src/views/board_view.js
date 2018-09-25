const CreateAppend = require('../helpers/create_append.js');
const boardPath = require('../models/board_path.js');
const colours = require('../models/colours.js');
const PubSub = require('../helpers/pub_sub.js');
const homes = require('../models/homes.js');
const Pawn = require('../models/pawn.js');
const path = require('path');


const BoardView = function (element) {
  this.element = element;
  this.board = null;

};

BoardView.prototype.bindEvents = function () {
  const board = new CreateAppend('div', "", this.element);
  board.classList.add('mainBoard');
  this.board = board;
  // console.log(board);
  this.renderBoard(13, board);
};

BoardView.prototype.renderBoard = function (dimensions, board) {
  for (let colID = 1; colID <= dimensions; colID++) {
    const colDiv = new CreateAppend('div', "", board);
    colDiv.id = colID;
    colDiv.classList.add('board');
    for (let rowID = 1; rowID <= dimensions; rowID++) {
      const rowDiv = new CreateAppend('div', ``, colDiv);
      rowDiv.id = `${colID},${rowID}`;
      rowDiv.classList.add('board');
      if (boardPath.includes(rowDiv.id)) {
        rowDiv.classList.add('path');
      };
      if (colours.red.includes(rowDiv.id)) {
        rowDiv.classList.add('red');
      }
      else if (colours.green.includes(rowDiv.id)) {
        rowDiv.classList.add('green');
      }
      else if (colours.blue.includes(rowDiv.id)) {
        rowDiv.classList.add('blue');
      }
      else if (colours.yellow.includes(rowDiv.id)) {
        rowDiv.classList.add('yellow');
      }
      else if (["7,7", "6,7", "7,6", "8,7", "7,8"].includes(rowDiv.id)) {
        rowDiv.classList.add('home');
        if (rowDiv.id == "7,7") {
        rowDiv.textContent = "⌂";
        }
      }
      PubSub.subscribe('Game:colour-chosen', (event) => {
        const colour = event.detail;
        for (let i = 1; i <= 4; i++) {
          if (homes[colour][i-1] === rowDiv.id) {
            const pawn = new CreateAppend('img', "", rowDiv);
            pawn.id = `${colour}${i}`;
            // console.log(colour);
            pawn.src = "/images/" + colour + ".png";
            pawn.alt = `${colour}`;
            const pawnObj = new Pawn(pawn.id, rowDiv.id);
            console.log(pawnObj);
            console.log(rowDiv);
            pawn.classList.add('pawn');
            pawn.addEventListener('click', (event) => {
              PubSub.publish('BoardView:pawn-selected', event.target.id)
              // console.log(event.target.id);
            })
          }
        }
      });
    }
  }
};


module.exports = BoardView;
