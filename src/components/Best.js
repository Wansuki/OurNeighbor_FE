import React, { useState, useEffect, useCallback, useMemo } from "react";
import BestForm from "./BestForm";
import Navbar from "./Navbar";
import Header from "./Header";
import { BrowserRouter, Route, Routes, Link, Outlet } from "react-router-dom";
import "../Best.css";
import "../Paging.css";
import Pagination from "react-js-pagination";
import BestPostView from "./BestPostView";
//* https://cotak.tistory.com/112 */
//  npm i react-js-pagination

const Best = (props) => {
  const bests = props.component;
  const [page, setPage] = useState(1);
  const [renderPage, setRenderPage] = useState("unfocused");
  const [buttonColor, setButtonColor] = useState("all");
  const [getName, setGetName] = useState("");
  const [search, setSearch] = useState(null);
  const [searchingText, setSearchingText] = useState(null);

  const searchSpace = (e) => {
    setSearch(e);
  };

  const searchedBests = bests.filter((best) => {
    if (search === "") return best;
    if (search === null) return best;
    else if (
      best.title.toLowerCase().includes(search.toLowerCase()) ||
      best.cont.toLowerCase().includes(search.toLowerCase())
    ) {
      return best;
    }
  });

  // 초기에는 unfocused 상태
  // focused 상태였다가 unfocused 상태가 다시 될 때 bestNo 값 다시 지정
  let a = 1;
  const BeforeonClicksetPage = searchedBests.map((best) => {
    best.bestNo = a;
    a++;
    return best;
  });

  // unfocused 상태일 때 각 페이지에 보여줄 객체들 필터
  const onClicksetPage = BeforeonClicksetPage.filter((best) => {
    return (
      (page - 1) * 9 + 1 <= best.bestNo && best.bestNo <= (page - 1) * 9 + 9
    );
  });

  // unfocused 상태일 때 보여줄 객체들 BestForm 형태로 나타내기
  const renderBests = onClicksetPage.map((best) => {
    return (
      <div className="best-flex">
        <BestForm
          best={best}
          key={best.bestNo}
          title={best.title}
          id={best.id}
        ></BestForm>
      </div>
    );
  });

  // unfocused 상태일 때
  // 처음에 보여주는 페이지는 1 페이지
  // focused -> unfocused 되기
  // 위의 함수들 실행
  const onBlurButton = () => {
    setPage(1);
    setRenderPage("unfocused");
    BeforeonClicksetPage();
    onClicksetPage();
    renderBests();
    return null;
  };

  // 버튼을 클릭했을 때
  // unfocusesd -> focused
  // 버튼의 name 가져온다
  const onClickButtonGetName = (e) => {
    let getName = "";
    setRenderPage("focused");
    return setGetName(getName.concat(e));
  };

  // name과 케테고리가 일치하는 것만 필터링
  const onClickButtonClassify = searchedBests.filter((best) => {
    return best.category === getName;
  });

  // bestNo 값 재지정
  let i = 1;
  const onClickButtonSetForm = onClickButtonClassify.map((best) => {
    best.bestNo = i;
    i++;
    return best;
  });

  // bestNo 값에 따라 페이지별로 보여줄 객체들 필터링
  const onClickButtonsetPage = onClickButtonSetForm.filter((best) => {
    return (
      (page - 1) * 9 + 1 <= best.bestNo && best.bestNo <= (page - 1) * 9 + 9
    );
  });

  // focused 상태일 때 보여줄 객체들 BestForm 형태로 나타내기
  const onClickButtonrenderBests = onClickButtonsetPage.map((best) => {
    return (
      <div className="best-flex">
        <BestForm
          best={best}
          key={best.bestNo}
          title={best.title}
          id={best.id}
        ></BestForm>
      </div>
    );
  });

  // 버튼 클릭하면
  // 위 함수들 실행
  // 처음에 보옂는 페이지는 1 페이지
  const onClickButton = (e) => {
    setPage(1);
    onClickButtonGetName(e);
    onClickButtonClassify();
    onClickButtonSetForm();
    onClickButtonsetPage();
    return null;
  };

  const handlePageChange = (page) => {
    setRenderPage("unfocused");
    setPage(page);
    window.scrollTo(0, 0);
  };

  const FocusedHandlePageChange = (page) => {
    setRenderPage("focused");
    setPage(page);
    window.scrollTo(0, 0);
  };

  const colorAll = buttonColor === "all" ? "#ffefb6" : "white";
  const colorFood = buttonColor === "food" ? "#ffefb6" : "white";
  const colorAcademy = buttonColor === "academy" ? "#ffefb6" : "white";
  const colorCafe = buttonColor === "cafe" ? "#ffefb6" : "white";
  const colorSports = buttonColor === "sports" ? "#ffefb6" : "white";

  const defineColor = (e) => {
    e === "all"
      ? setButtonColor("all")
      : e === "food"
      ? setButtonColor("food")
      : e === "academy"
      ? setButtonColor("academy")
      : e === "cafe"
      ? setButtonColor("cafe")
      : e === "sports"
      ? setButtonColor("sports")
      : setButtonColor("all");
  };

  return (
    <div className="App">
      <div className="content">
        <Header></Header>
        <Navbar></Navbar>
        <div className="best-section1">
          <span className="best-sub-title1">추천게시판</span>
          <span className="best-section1-right">
            <Link to="/bestAdd">
              <button className="best-add-btn">글 쓰기</button>
            </Link>
          </span>
          <div className="best-section1-bottom">
            <div>HOT 카테고리</div>
            <span className="keywords">
              <button
                name="all"
                className="best-keyword"
                onFocus={(e) => {
                  defineColor(e.target.name);
                }}
                onClick={onBlurButton}
                style={{ backgroundColor: colorAll }}
              >
                전체
              </button>
              <button
                name="food"
                className="best-keyword"
                onFocus={(e) => {
                  defineColor(e.target.name);
                }}
                onClick={(e) => {
                  onClickButton(e.target.name);
                }}
                style={{ backgroundColor: colorFood }}
              >
                맛집
              </button>
              <button
                name="academy"
                className="best-keyword"
                onFocus={(e) => {
                  defineColor(e.target.name);
                }}
                onClick={(e) => {
                  onClickButton(e.target.name);
                }}
                style={{ backgroundColor: colorAcademy }}
              >
                학원
              </button>
              <button
                name="cafe"
                className="best-keyword"
                onFocus={(e) => {
                  defineColor(e.target.name);
                }}
                onClick={(e) => {
                  onClickButton(e.target.name);
                }}
                style={{ backgroundColor: colorCafe }}
              >
                카페
              </button>
              <button
                name="sports"
                className="best-keyword"
                onFocus={(e) => {
                  defineColor(e.target.name);
                }}
                onClick={(e) => {
                  onClickButton(e.target.name);
                }}
                style={{ backgroundColor: colorSports }}
              >
                운동시설
              </button>
            </span>
            <span className="search">
              <img className="best-search-btn" src="../img/search.png"></img>
              <input
                className="best-input"
                placeholder="제목 / 내용 검색"
                value={searchingText}
                onChange={(e) => {
                  setSearchingText(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    searchSpace(e.target.value);
                  }
                }}
              ></input>
            </span>
          </div>
        </div>
        <div className="line"></div>
        <div className="best-section2">
          {renderPage === "unfocused" ? renderBests : onClickButtonrenderBests}
        </div>
      </div>
      <div>
        {/* https://cotak.tistory.com/112 */}
        <Pagination
          activePage={page}
          itemsCountPerPage={5}
          totalItemsCount={
            renderPage === "unfocused"
              ? parseInt(BeforeonClicksetPage.length % 9) === 0
                ? parseInt(BeforeonClicksetPage.length / 9) * 5
                : (parseInt(BeforeonClicksetPage.length / 9) + 1) * 5
              : parseInt(onClickButtonSetForm.length % 9) === 0
              ? parseInt(onClickButtonSetForm.length / 9) * 5
              : (parseInt(onClickButtonSetForm.length / 9) + 1) * 5
          }
          pageRangeDisplayed={5}
          prevPageText={"<"}
          nextPageText={">"}
          onFocus={(e) => {
            onClickButton(e.target.name);
          }}
          onChange={
            renderPage === "unfocused"
              ? handlePageChange
              : FocusedHandlePageChange
          }
        />
      </div>
    </div>
  );
};

export default Best;