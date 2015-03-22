"use strict";


/**   Very simple module that exports a function for the final message
  *   after eggs-genny is done installing everything/doing it's thing
  */

module.exports = function( greeting ){

  var ready = "\n"+
              "   ___                     \n"+
              "  /   \\    Your            \n"+
              " |     |___  eggs          \n"+
              " |     /   \\   are         \n"+
              "  \\___|     |    ready,    \n"+
              "      |     |        "+greeting+"\n"+
              "       \\___/               \n";

  return ready;
};
