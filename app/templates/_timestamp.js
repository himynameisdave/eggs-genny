module.exports = {
  timePlz: function(){

    var D  = new Date(),
        h  = D.getHours(),
        m  = D.getMinutes(),
        s  = D.getSeconds(),
        dt = D.getDate(),
        yr = D.getFullYear(),
        months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        mt = months[D.getMonth()];

        //  convert to 12 hour time
        if(h > 12){ h = h - 12; }
        if(h === 0){ h = 12; }

        //  in case mins is lower than 10
        if( m < 10 ){ m = '0' + m; }

        //  in case seconds is lower than 10
        if( s < 10 ){ s = '0' + s; }

        return mt + ' ' + dt + ', ' + yr + ' at ' + h + ':' + m + ':' + s;

  }
};
