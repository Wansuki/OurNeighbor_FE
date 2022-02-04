import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import "../BestAdd.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BestAdd = () => {
  const [bestTitle, setBestTitle] = useState("");
  const [bestContent, setBestContent] = useState("");
  // 카테고리 뜨기
  const [showCategory, setShowCategory] = useState("none");
  const navigate = useNavigate();

  const onShowCategory = (e) => {
    if (e.target.name === "food") {
      e.preventDefault();
      setShowCategory("food");
    }
    if (e.target.name === "academy") {
      e.preventDefault();
      setShowCategory("academy");
    }
    if (e.target.name === "cafe") {
      e.preventDefault();
      setShowCategory("cafe");
    }
    if (e.target.name === "sports") {
      e.preventDefault();
      setShowCategory("sports");
    }
  };

  const onClickNone = () => {
    setShowCategory("none");
  };

  const [image, setImage] = useState([]);
  console.log(image);

  const onSubmit = (e) => {
    e.preventDefault();
    //add함수 props로 받아오기
    axios
      .post(
        "/recommend-posts",
        `title=${bestTitle}&&content=${bestContent}&&category=${showCategory}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        alert("글이 정상적으로 작성되었습니다.");
        if (res.data) {
          navigate("/best");
        }
      });
    const formData = new FormData();
    // for (let i = 0; i < FileElement.files.length; i++) {
    //   formData.append("files", FileElement.files[i]);
    // }
    axios
      .post(
        "/recommend-posts",
        `title=${bestTitle}&&content=${bestContent}&&category=${showCategory}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        alert("글이 정상적으로 작성되었습니다.");
        if (res.data) {
          navigate("/best");
        }
      });
  };

  return (
    <div className="App">
      <div className="content">
        <Header></Header>
        <Navbar></Navbar>
        <div className="section1">
          <span className="sub-title1">추천 게시판</span>
        </div>
        <div className="line"></div>
        <div className="bestAdd-section2">
          <form>
            <span className="bestAddTitle">제목</span>
            <input
              className="bestAddTitleInput"
              type="text"
              onChange={(e) => setBestTitle(e.target.value)}
              value={bestTitle}
            />
            <div className="bestAddContent">내용</div>
            <textarea
              className="bestAddTextarea"
              type="text"
              value={bestContent}
              onChange={(e) => setBestContent(e.target.value)}
            />
            <div className="bestAddImg">사진 첨부</div>
            <input
              type="file"
              className="imgInput"
              id="bestImg"
              accept="image/*"
              name="file"
              value={image}
              onChange={(e) => {
                setImage(image.concat(e.target.value));
              }}
            ></input>
            <div className="best-categoryText">카테고리</div>
            <div className="best-selectedCategories">
              {showCategory === "food" && (
                <div className="best-selectedCategory">
                  <div
                    name="food"
                    className="bestAdd-keyword"
                    style={{
                      width: "85px",
                      height: "22px",
                    }}
                  >
                    맛집
                  </div>
                  <div onClick={onClickNone} className="best-unshown">
                    -
                  </div>
                </div>
              )}
              {showCategory === "academy" && (
                <div className="best-selectedCategory">
                  <div
                    name="academy"
                    className="bestAdd-keyword"
                    style={{
                      width: "85px",
                      height: "22px",
                    }}
                  >
                    학원
                  </div>
                  <div onClick={onClickNone} className="best-unshown">
                    -
                  </div>
                </div>
              )}
              {showCategory === "cafe" && (
                <div className="best-selectedCategory">
                  <div
                    name="cafe"
                    className="bestAdd-keyword"
                    style={{
                      width: "85px",
                      height: "22px",
                    }}
                  >
                    카페
                  </div>
                  <div onClick={onClickNone} className="best-unshown">
                    -
                  </div>
                </div>
              )}
              {showCategory === "sports" && (
                <div className="best-selectedCategory">
                  <div
                    name="sports"
                    className="bestAdd-keyword"
                    style={{
                      width: "85px",
                      height: "22px",
                    }}
                  >
                    운동시설
                  </div>
                  <div onClick={onClickNone} className="best-unshown">
                    -
                  </div>
                </div>
              )}
            </div>
            <div className="best-hotCategoryText">HOT 카테고리</div>
            <div className="best-hotCategory">
              <button
                name="food"
                className="bestAdd-keyword"
                onClick={(e) => onShowCategory(e)}
                style={{ backgroundColor: "white" }}
              >
                맛집
              </button>
              <button
                name="academy"
                className="bestAdd-keyword"
                onClick={(e) => onShowCategory(e)}
                style={{ backgroundColor: "white" }}
              >
                학원
              </button>
              <button
                name="cafe"
                className="bestAdd-keyword"
                onClick={(e) => onShowCategory(e)}
                style={{ backgroundColor: "white" }}
              >
                카페
              </button>
              <button
                name="sports"
                className="bestAdd-keyword"
                onClick={(e) => onShowCategory(e)}
                style={{ backgroundColor: "white" }}
              >
                운동시설
              </button>
            </div>
            <button className="bestAddCompleteBtn" onClick={onSubmit}>
              작성 완료
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BestAdd;
