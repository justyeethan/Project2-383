(function () {
  window.addEventListener("load", init);
  function init() {
    restart();
    $(".seq").keyup(function () {
      restart();
    });

    $(".params").change(function () {
      restart();
    });

    $(".btn-clear").click(function () {
      clear();
    });

    $(".btn-compute").click(function () {
      restart();
    });

    $(".btn-custom").click(function () {
      GridBuilder.startCustomPath();
    });
  }
  function restart() {
    clear();
    GridBuilder.highlightOptimal();
  }
  function clear() {
    let cont = $("#cont");
    let resultContainer = $("#result");
    let matchScore = parseInt($("#matchScore").val());
    let mismatchScore = parseInt($("#mismatchScore").val());
    let gapScore = parseInt($("#gapScore").val());
    let seqSide = $("#seq_1").val();
    let seqTop = $("#seq_2").val();

    GridBuilder.rebuildTable(
      cont,
      resultContainer,
      matchScore,
      mismatchScore,
      gapScore,
      seqSide,
      seqTop
    );
  }
})();
