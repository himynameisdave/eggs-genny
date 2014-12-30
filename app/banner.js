"use strict"

var chalk = require( "chalk" ),
    cols  = [ 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray' ],
    color1 = cols[Math.floor( Math.random() * cols.length )],
    color2 = cols[Math.floor( Math.random() * cols.length )];


while( color2 === color1 ){
  color2 = cols[Math.floor( Math.random() * cols.length )];
}

module.exports = chalk[color1](
"\n   _______                                              " +
"\n  |       |  ________   ________                        " +
"\n  |   ____| |   __   | |   __   |  ________             " +
"\n  |  |__    |  |__|  | |  |__|  | |   _____|            " +
"\n  |   __|   |_____   | |_____   | |  |_____             " +
"\n  |  |____   __   |  |  __   |  | |______  |            " +
"\n  |       | |  |__|  | |  |__|  |  ______| |            " +
"\n  |_______| |________| |________| |________|            " ) +
chalk[color2](
"\n   _________                                    __   __ " +
"\n  |   ___   |    ______   __  ____   __  ____  |  | /  /" +
"\n  |  |   |__|   |   _  | |  |/    | |  |/    | |  |/  / " +
"\n  |  |  ______  |  |_| | |   __   | |   __   | |     /  " +
"\n  |  | |_    _| |   ___| |  |  |  | |  |  |  | |    /   " +
"\n  |  |___|  |   |  |___  |  |  |  | |  |  |  | |   |    " +
"\n  |_________|   |______| |__|  |__| |__|  |__| |___|    " +
"\n                                                        ") +
chalk.gray( "\n  Created by Dave Lunny in the beautiful year 2015\n");
