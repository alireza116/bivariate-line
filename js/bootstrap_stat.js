function bootstrap_stat() {
  //requires jStat
  var jStat = window.jStat;

  this.bootstrap = function(data, n_boot = 10000) {
    var bsResult = [];
    for (var i = 0; i < n_boot; i++) {
      var resample = [];
      for (var j = 0; j < data.length; j++) {
        var sample = data[Math.floor(Math.random() * data.length)];

        resample.push(sample);
      }
      bsResult.push(resample);
    }
    return bsResult;
  };

  this.boot_ci_mean = function(data, alpha = 0.05) {
    //requires data to be numerical;
    var bootstrap = this.bootstrap(data);
    var means = bootstrap.map(function(b) {
      return jStat.mean(b);
    });
    var mean = jStat.mean(means);
    var CI = jStat.quantiles(means, [0 + alpha / 2, 1 - alpha / 2]);
    return { mean: mean, CI: CI };
  };

  this.boot_ci_pearsonr = function(data, alpha = 0.05) {
    var bootstrap = this.bootstrap(data);
    var pearsonRs = bootstrap.map(function(b) {
      var x = b.map(function(d) {
        return d[0];
      });
      var y = b.map(function(d) {
        return d[1];
      });
      return jStat.corrcoeff(x, y);
    });

    var pearsonr = jStat.mean(pearsonRs);
    var CI = jStat.quantiles(pearsonRs, [0 + alpha / 2, 1 - alpha / 2]);
    return { pearsonr: pearsonr, CI: CI };
  };
}
