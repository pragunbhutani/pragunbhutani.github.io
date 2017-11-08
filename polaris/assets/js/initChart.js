var demo = {
  initChart: function() {
    var dataSales = {
      labels: ['01 Jan', '08 Jan', '15 Jan', '22 Jan', '29 Jan', '5 Feb', '12 Feb', '19 Feb', '26 Feb', '5 Mar', '12 Mar', '19 Mar'],
      series: [
        [19, 39, 34, 22, 28, 42, 40, 30, 34, 0, 0, 0],
        [15, 34, 29, 17, 24, 36, 25, 17, 15, 39, 36, 21],
        // [19, 39, 34, 22, 28, 42, 40, 30, 34, 33, 39, 24],
      ]
    };

    var optionsSales = {
      lineSmooth: false,
      low: 0,
      high: 60,
      showArea: false,
      height: "275px",
      axisX: {
        showGrid: false,
      },
      showLine: true,
      showPoint: true,
    };

    var responsiveSales = [
      ['screen and (max-width: 640px)', {
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];

    Chartist.Line('#chartSignups', dataSales, optionsSales, responsiveSales);
  }
}