"use strict";

let GridBuilder = (function () {
  //Some instance letiables
  let mIsFirstCall = true,
    mSelf = null,
    mCurrentPath = [],
    mPathTable = [],
    mCellMap = {},
    mTopSequence = "",
    mSideSequence = "",
    mDomContainer = null,
    mDomResultContainer = null,
    mGapSymbol = "-",
    mIsCustomPathMode = false,
    mMatchScore = 0,
    mMismatchScore = 0,
    mGapScore = 0;

  function onCellClicked(dom, x, y) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);

    let lastElement = null;
    if (mCurrentPath !== null && mCurrentPath.length !== 0) {
      lastElement = mCurrentPath[mCurrentPath.length - 1];

      if (dom.hasClass("in-path")) {
        if (mCurrentPath.length === 1) {
          mCurrentPath[0].dom.removeClass("in-path");
          mCurrentPath[0].dom.removeClass("is-last");
          mCurrentPath[0].dom.removeAttr("data-index");
          mCurrentPath = [];
          onPathUpdate();
          return true;
        }

        let indexInPath = parseInt(dom.attr("data-index"), 10);
        for (let i = indexInPath + 1; i < mCurrentPath.length; i++) {
          mCurrentPath[i].dom.removeClass("in-path");
          mCurrentPath[i].dom.removeClass("is-last");
          mCurrentPath[i].dom.removeAttr("data-index");
        }
        mCurrentPath.splice(
          indexInPath + 1,
          mCurrentPath.length - indexInPath + 1
        );
        mCurrentPath[mCurrentPath.length - 1].dom.addClass("is-last");
        onPathUpdate();
        return true;
      }
      if (lastElement.x < x || lastElement.y < y) {
        return false;
      }

      if (x - lastElement.x < -1 || y - lastElement.y < -1) {
        return false;
      }
    }

    dom.attr("data-index", mCurrentPath.length);

    mCurrentPath.push({
      idx: mCurrentPath.length,
      x: x,
      y: y,
      dom: dom,
      previous: lastElement,
    });

    if (lastElement) {
      lastElement.dom.removeClass("is-last");
    }

    dom.addClass("is-last");
    dom.addClass("in-path");
    onPathUpdate();
    return true;
  }

  function onPathUpdate() {
    let alignedTopSeq = "";
    let alignedSideSeq = "";

    $("th").removeClass("included");

    for (let i = mCurrentPath.length - 1; i >= 0; i--) {
      let currentCell = mCurrentPath[i];
      let nextCell = i > 0 ? mCurrentPath[i - 1] : null;

      let topChar = mTopSequence[currentCell.x];
      let sideChar = mSideSequence[currentCell.y];

      if (!nextCell) {
        continue;
      }

      if (topChar) {
        if (currentCell.x != nextCell.x) {
          $("#top_seq_" + currentCell.x).addClass("included");
        }
      }

      if (sideChar) {
        if (currentCell.y != nextCell.y) {
          $("#side_seq_" + currentCell.y).addClass("included");
        }
      }

      // Checks the diagonal move to see if it is possible
      if (nextCell.x - currentCell.x > 0 && nextCell.y - currentCell.y > 0) {
        alignedTopSeq += topChar;
        alignedSideSeq += sideChar;
        continue;
      }

      if (nextCell.x - currentCell.x > 0) {
        sideChar = mGapSymbol;
      }

      if (nextCell.y - currentCell.y > 0) {
        topChar = mGapSymbol;
      }

      alignedTopSeq += topChar;
      alignedSideSeq += sideChar;
    }

    $("#alignment").remove();

    let $table = $("<table />").attr("id", "alignment");
    mDomAlignmentTable = $table;
    let score = 0;
    let $tr = $("<tr />");
    for (let idxTop in alignedTopSeq) {
      let c1 = alignedTopSeq[idxTop];
      let c2 = alignedSideSeq[idxTop];

      if (c1 === mGapSymbol || c2 === mGapSymbol) {
        score += mGapScore;
      } else if (c1 === c2) {
        score += mMatchScore;
      } else {
        score += mMismatchScore;
      }
      $tr.append($("<td />").html(c1));
    }
    $table.append($tr);

    $tr = $("<tr />");
    for (let idxSide in alignedSideSeq) {
      $tr.append($("<td />").html(alignedSideSeq[idxSide]));
    }
    $table.append($tr);

    $tr = $("<tr />");
    $tr.append(
      $('<td colspan="1500" class="score" />').html("Score = " + score)
    );
    $table.append($tr);

    mDomResultContainer.append($table);
  }

  function displayTooltip(text, x, y) {
    if ($("#tooltip").length === 0) {
      $("body").prepend($("<div />").attr("id", "tooltip"));
    }
    let tt = $("#tooltip").html("");
    let tooltipHeight = 30;

    let xBorder = x + tt.width() + 30;
    if (xBorder > $(window).width()) x -= xBorder - $(window).width();

    let yBorder = y + tt.height() + 30;
    if (yBorder > $(window).height()) y -= tooltipHeight * 2;

    tt.append(text);
    tt.css("left", x);
    tt.css("top", y);
    tt.css("display", "block");
  }

  function hideTooltip() {
    $("#tooltip").css("display", "none");
  }

  function showTooltip(x, y) {
    let $table = $("<table />");

    $("#" + (x - 1) + "_" + (y - 1)).addClass("highlight");
    $("#" + (x - 0) + "_" + (y - 1)).addClass("highlight");
    $("#" + (x - 1) + "_" + (y - 0)).addClass("highlight");

    let targetDom = $("#" + x + "_" + y);
    let pos = targetDom.offset();
    targetDom.addClass("highlight-main");
    displayTooltip(
      $table,
      pos.left + targetDom.width() + 10,
      pos.top - targetDom.height() / 2
    );
  }

  function getCssClassesFromDirection(directions) {
    let cssClasses = "";

    if (!Array.isArray(directions)) {
      return cssClasses;
    }

    cssClasses = directions.join(" ");

    return cssClasses;
  }

  function constructNRow(n) {
    let $table = $("#grid");
    let charIndex = parseInt(n, 10) - 1;
    let $tr = $("<tr />");
    let $th = null;

    if (charIndex >= 0) {
      $th = $("<th />")
        .addClass("seq-header")
        .addClass("side-header")
        .attr("id", "side_seq_" + charIndex)
        .html(mSideSequence[charIndex]);
      $tr.append($th);
    } else {
      $th = $("<th />");
      $tr.append($th);
    }

    let $td = $("<td />")
      .html(mCellMap[0 + "_" + n].winningScore)
      .addClass("bg-gray-500")
      .attr("data-x", 0)
      .attr("data-y", n)
      .attr("id", 0 + "_" + n);
    $tr.append($td);

    for (let idx in mTopSequence) {
      idx = parseInt(idx, 10);
      let dataPointIndex = idx + 1 + "_" + (charIndex + 1);

      let cssClasses = "";
      if (n > 0) {
        cssClasses = getCssClassesFromDirection(
          mCellMap[idx + 1 + "_" + (charIndex + 1)].direction
        );
      }

      $td = $("<td />")
        .addClass(cssClasses)
        .addClass("bg-gray-500")
        .html(mCellMap[dataPointIndex].winningScore)
        .attr("data-x", idx + 1)
        .attr("data-y", charIndex + 1)
        .attr("data-dg", mCellMap[dataPointIndex].diagonalScoreText)
        .attr("data-up", mCellMap[dataPointIndex].upScoreText)
        .attr("data-sd", mCellMap[dataPointIndex].sideScoreText)
        .attr("id", dataPointIndex);
      $tr.append($td);
    }

    $table.append($tr);
    mDomContainer.append($table);
  }

  function constructGrid() {
    $("#alignment").remove();
    $("#grid").remove();
    let $table = $("<table />").attr("id", "grid");
    mDomGridTable = $table;
    mDomContainer.append($table);

    let $tr = $("<tr />");

    let $th = $("<th />");
    $tr.append($th);

    $th = $("<th />");
    $tr.append($th);

    for (let idx in mTopSequence) {
      $th = $("<th />");
      $th.attr("id", "top_seq_" + idx);
      $th.addClass("seq-header");
      $th.addClass("top-header");
      $th.html(mTopSequence[idx]);
      $tr.append($th);
    }

    $table.append($tr);

    for (let i = 0; i < mSideSequence.length + 1; i++) {
      constructNRow(i);
    }

    $("#grid td").click(function () {
      let self = $(this);
      onCellClicked(self, self.attr("data-x"), self.attr("data-y"));
    });

    $("#grid td").hover(
      function () {
        if (mIsCustomPathMode) {
          return;
        }

        let self = $(this);
        let x = self.attr("data-x");
        let y = self.attr("data-y");

        if (x < 1 || y < 1) {
          return;
        }
        $("#side_seq_" + (y - 1)).addClass("highlight");
        $("#top_seq_" + (x - 1)).addClass("highlight");

        showTooltip(x, y);
      },
      function () {
        $(".seq-header").removeClass("highlight");
        $("#grid td").removeClass("highlight");
        $("#grid td").removeClass("highlight-main");
        hideTooltip();
      }
    );

    $("#grid th").hover(
      function () {
        let self = $(this);
        if (!self.hasClass("seq-header")) {
          return;
        }

        let pos = self.offset();
        let topMargin = self.hasClass("side-header")
          ? self.height() / 4
          : self.height() + 4;
        let leftMargin = self.hasClass("side-header") ? self.width() + 4 : 0;
        let text = self.hasClass("included")
          ? "Included In Alignment"
          : "Not Included In Alignment";

        displayTooltip(text, pos.left + leftMargin, pos.top + topMargin);
      },
      function () {
        hideTooltip();
      }
    );
  }

  mSelf = {
    highlightOptimal: function () {
      mIsCustomPathMode = false;
      let width = mTopSequence.length + 1;
      let height = mSideSequence.length + 1;

      let currentX = width - 1;
      let currentY = height - 1;
      while (currentX > -1 && currentY > -1) {
        let currentCell = mCellMap[currentX + "_" + currentY];
        let currentDom = $("#" + currentX + "_" + currentY);

        currentDom.click();

        let direction = null;
        if (currentCell.direction) {
          direction = currentCell.direction[currentCell.direction.length - 1];
        }

        if (direction === null) {
          if (currentX == 0) {
            direction = "u";
          }
          if (currentY == 0) {
            direction = "s";
          }
        }

        switch (direction) {
          case "s":
            currentX--;
            break;
          case "u":
            currentY--;
            break;
          default:
          case "d":
            currentX--;
            currentY--;
            break;
        }
      }
    },

    startCustomPath: function () {
      this.rebuildTable(
        mDomContainer,
        mDomResultContainer,
        mMatchScore,
        mMismatchScore,
        mGapScore,
        mSideSequence,
        mTopSequence
      );
      mIsCustomPathMode = true;
    },

    rebuildTable: function (
      domContainer,
      resultContainer,
      matchScore,
      mismatchScore,
      gapScore,
      seqSide,
      seqTop
    ) {
      if (mIsFirstCall) {
        $(window).mousemove(function (e) {
          window.mouseXPos = e.pageX;
          window.mouseYPos = e.pageY;
        });
        mIsFirstCall = false;
      }

      seqTop = seqTop.toUpperCase();
      seqSide = seqSide.toUpperCase();
      mCurrentPath = [];
      mDomContainer = domContainer;
      mDomResultContainer = resultContainer;
      mTopSequence = seqTop;
      mSideSequence = seqSide;
      mMatchScore = matchScore;
      mMismatchScore = mismatchScore;
      mGapScore = gapScore;

      let width = mTopSequence.length + 1;
      let height = mSideSequence.length + 1;

      for (let i = 0; i < width; i++) {
        mPathTable[i] = [];
        for (let j = 0; j < height; j++) {
          if (i === 0 && j === 0) {
            mPathTable[i][j] = 0;
            mCellMap[i + "_" + j] = {
              winningScore: mPathTable[i][j],
            };
            continue;
          }

          if (i === 0) {
            mPathTable[i][j] = j * gapScore;
            mCellMap[i + "_" + j] = {
              winningScore: mPathTable[i][j],
            };
            continue;
          }

          if (j === 0) {
            mPathTable[i][j] = i * gapScore;
            mCellMap[i + "_" + j] = {
              winningScore: mPathTable[i][j],
            };
            continue;
          }

          let isMatch = mTopSequence[i - 1] === mSideSequence[j - 1];
          let comparisonScore = isMatch ? matchScore : mismatchScore;
          let moveUpScore = mPathTable[i][j - 1] + gapScore;
          let moveSdScore = mPathTable[i - 1][j] + gapScore;
          let moveDgScore =
            parseInt(comparisonScore, 10) + parseInt(mPathTable[i - 1][j - 1]);
          mPathTable[i][j] = Math.max(moveUpScore, moveSdScore, moveDgScore);

          let direction = [];

          if (mPathTable[i][j] === moveDgScore) {
            direction.push("d");
          }

          if (mPathTable[i][j] === moveUpScore) {
            direction.push("u");
          }

          if (mPathTable[i][j] === moveSdScore) {
            direction.push("s");
          }

          mCellMap[i + "_" + j] = {
            sideScoreText:
              mPathTable[i - 1][j] +
              " + " +
              gapScore +
              " (The Gap score) = " +
              moveSdScore,
            upScoreText:
              mPathTable[i][j - 1] +
              " + " +
              gapScore +
              " (The Gap score) = " +
              moveUpScore,
            diagonalScoreText:
              mPathTable[i - 1][j - 1] +
              " + " +
              parseInt(comparisonScore, 10) +
              " (Due to a " +
              (isMatch ? "match" : "mismatch") +
              " between " +
              mTopSequence[i - 1] +
              " & " +
              mSideSequence[j - 1] +
              ") " +
              " = " +
              moveDgScore,
            sideScore: moveSdScore,
            upScore: moveUpScore,
            diagonalScore: moveDgScore,
            winningScore: mPathTable[i][j],
            direction: direction,
          };
        }
      }
      constructGrid();
    },
  };
  return mSelf;
})();
