import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import "../BestPostView.css";
import ListGroup from "react-bootstrap/ListGroup";
import { useHistory, useParams, Outlet } from "react-router-dom";
import bests from "./Best";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "../PostList.css";

const BestPostView = (props) => {
  const bests = props.component;
  const num = bests.length;
  const { bestNo, category } = useParams();

  const matchItem = props.component.find(function (element) {
    if (element.bestNo === Number(bestNo) && element.category === category)
      return true;
  });

  const categoryName = () => {
    if (matchItem.category === "food") return "맛집";

    if (matchItem.category === "academy") return "학원";

    if (matchItem.category === "cafe") return "카페";

    if (matchItem.category === "sports") return "운동시설";
  };

  const postList =
    parseInt(bestNo) === 1
      ? bests.slice(parseInt(bestNo) - 1, parseInt(bestNo) + 4)
      : parseInt(bestNo) === 2
      ? bests.slice(parseInt(bestNo) - 2, parseInt(bestNo) + 3)
      : parseInt(bestNo) === parseInt(num) - 1
      ? bests.slice(parseInt(bestNo) - 4, parseInt(bestNo) + 1)
      : parseInt(bestNo) === parseInt(num)
      ? bests.slice(parseInt(bestNo) - 5, parseInt(bestNo) + 0)
      : bests.slice(parseInt(bestNo) - 3, parseInt(bestNo) + 2);

  return (
    <div className="App">
      <div className="content">
        <Header></Header>
        <Navbar></Navbar>
        <div className="section1">
          <span className="sub-title1">추천게시판</span>
        </div>
        <div className="line"></div>
        <div className="bestPostView-section1">
          <span className="bestPostView-title">{matchItem.title}</span>
          <div className="bestPostView-subtitle">
            <span>{matchItem.title}</span>
            <span>/</span>
            <span>작성자: {matchItem.member_id}</span>
          </div>
          <img className="bestPostView-img" src={matchItem.img}></img>
          <div className="bestPostView-content">
            {matchItem.cont.split("\n").map((line) => {
              return (
                <span>
                  {line}
                  <br />
                </span>
              );
            })}
          </div>
        </div>
        <div className="category-line"></div>
        <div className="category-name">카테고리</div>
        <div className="category">
          <span className="category-type">{categoryName()}</span>
        </div>
        <div className="relpy-line"></div>
        <div className="bestPostView-section2">
          <div className="reply-title">댓글</div>
          <div className="reply-id">오새별</div>
          <textarea className="reply-input"></textarea>
          <button className="replybtn">댓글 달기</button>
        </div>
        <div className="pagination-line"></div>
        <div className="pagination">
          <div className="pagination-title">이전 글 / 다음 글</div>
          <div className="pagination-pages">
            {postList
              ? postList.map((item, index) => {
                  return parseInt(item.bestNo) ===
                    parseInt(matchItem.bestNo) ? (
                    <Link
                      to={`/bestPostView/${item.category}/${item.bestNo}`}
                      style={{ textDecoration: "none", color: "#ffa800" }}
                      onClick={window.scrollTo(0, 0)}
                    >
                      <div className="postlist" key={index}>
                        <div className="postlist-title">{item.title}</div>
                        <div className="postlist-date">{item.date}</div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to={`/bestPostView/${item.category}/${item.bestNo}`}
                      style={{ textDecoration: "none", color: "#443333" }}
                      onClick={window.scrollTo(0, 0)}
                    >
                      <div className="postlist" key={index}>
                        <div className="postlist-title">{item.title}</div>
                        <div className="postlist-date">{item.date}</div>
                      </div>
                    </Link>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestPostView;
