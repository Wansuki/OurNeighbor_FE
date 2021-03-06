import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import "../BestPostView.css";
import { useHistory, useParams, Outlet } from "react-router-dom";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "../PostList.css";
import ParentComment from "./ParentComment";
import axios from "axios";
import ChildComponent from "./ChildComponent";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BestPostView = () => {
  const { id } = useParams();
  const [best, setBest] = useState([]);
  const [bests, setBests] = useState([]);
  const num = bests.length;
  const navigate = useNavigate();

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.accessToken}`;

  // 전체 게시글 정보를 불러와서 bests에 저장
  useEffect(() => {
    axios
      .get("/apartments/recommend-posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setBests(res.data);
      })
      .catch((err) => console.log(err));
  }, [useParams()]);

  // 해당 게시글 정보를 불러와서 best에 저장
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("/recommend-posts/" + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(async (res) => {
        console.log(res.data);
        setBest(res.data);
        let s = [];
        if (res.data && res.data.photoIds.length !== 0) {
          let w = res.data.photoIds.length;
          for (let i = 0; i < res.data.photoIds.length; i++) {
            axios({
              method: "GET",
              url: "/photo/" + String(res.data.photoIds[i]),
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
              .then((res) => {
                s.push(
                  window.URL.createObjectURL(
                    new Blob([res.data], {
                      type: res.headers["content-type"],
                    })
                  )
                );
                if (w === s.length) {
                  setImages(s);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => console.log(err));
  }, [useParams()]);

  // 이미지 보여주는 코드

  const showImages = (images !== undefined ? images : [1]).map((element) => {
    return (
      <div>
        <img className="postView-img" src={element} alt="fail"></img>
      </div>
    );
  });

  // 현재 로그인된 유저 정보 - 닉네임을 author에 저장
  const [author, setAuthor] = useState("");

  useEffect(() => {
    axios
      .get("/member/info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setAuthor(res.data.nickName);
      })
      .catch((err) => console.log(err));
  }, [useParams()]);

  // 게시글 삭제 버튼 누를 때 실행
  const onClickDeleteButton = (e) => {
    e.preventDefault();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: "게시글을 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니요",
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete("/recommend-posts/" + id, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: "삭제되었습니다.",
              });
              navigate("/best");
              // < 이미지 삭제 >
              // console.log(parseInt(best.photoIds[0]));
              // for (let i = parseInt(best.photoIds[0]); i < best.photoIds.length; i++) {
              //   console.log(i);
              //   axios
              //     .delete("/photo/" + String(i), {
              //       headers: {
              //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              //       },
              //     })
              //     .then((res) => {
              //       alert("사진도 삭제되었습니다.");
              //       navigate("/best");
              //     })
              //     .catch((err) => console.log(err));
              // }
            })
            .catch((err) => console.log(err));
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "취소합니다.",
          });
        }
      });
  };

  // 게시글 삭제 버튼 보여주는 코드
  const showDeleteButton = (e) => {
    if (String(author) === String(best.author)) {
      return (
        <button
          className="best-deleteButton"
          onClick={(e) => onClickDeleteButton(e)}
          data-swal-template="#my-template"
        >
          | 게시글 삭제 |
        </button>
      );
    }
  };

  // 이전글/다음글
  let a = 1;
  bests.map((bestE) => {
    bestE.bestNo = a;
    if (best.id === bestE.id) {
      best.bestNo = a;
    }
    a = a + 1;
  });

  const postList =
    parseInt(bests.length) <= 5
      ? bests
      : parseInt(best.bestNo) === 1
      ? bests.slice(parseInt(best.bestNo) - 1, parseInt(best.bestNo) + 4)
      : parseInt(best.bestNo) === 2
      ? bests.slice(parseInt(best.bestNo) - 2, parseInt(best.bestNo) + 3)
      : parseInt(best.bestNo) === parseInt(num) - 1
      ? bests.slice(parseInt(best.bestNo) - 4, parseInt(best.bestNo) + 1)
      : parseInt(best.bestNo) === parseInt(num)
      ? bests.slice(parseInt(best.bestNo) - 5, parseInt(best.bestNo) + 0)
      : bests.slice(parseInt(best.bestNo) - 3, parseInt(best.bestNo) + 2);

  // 카테고리 이름 보여주는 함수
  const categoryName = () => {
    if (best.category === "food") return "맛집";

    if (best.category === "academy") return "학원";

    if (best.category === "cafe") return "카페";

    if (best.category === "sports") return "운동시설";
  };

  // <대댓글 구현>
  const [commentContents, setCommentContents] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [responseTo, setResponseTo] = useState(0);
  const commentPageType = "recommend";

  // 댓글, 대댓글 get 해오기
  useEffect(() => {
    axios
      .get("/recommend-posts/comments/" + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        // commentList 초기화 및 get 해온 댓글, 대댓글 추가
        console.log(res.data);
        if (commentList.length === 0) {
          setCommentList(commentList.concat(res.data));
        }
      })
      .catch((err) => console.log(err));
  }, [useParams()]);

  // 댓글들 보여주기
  const beforeShowComments = commentList.filter((comment) => {
    return comment.commentType === "parent";
  });

  const showComments =
    commentList === []
      ? null
      : beforeShowComments.map((parentComment, index) => {
          return (
            <ParentComment
              parentComment={parentComment}
              commentList={commentList}
              setCommentList={setCommentList}
              id={id}
              index={index}
              author={author}
              commentPageType={commentPageType}
            ></ParentComment>
          );
        });

  // 댓글 작성 => commentContents에 저장
  const getValue = (e) => {
    setCommentContents(e.target.value);
  };

  // 댓글 작성 버튼 누를 때
  const addComment = (e) => {
    e.preventDefault();
    // 댓글 없으면 alert 띄우기
    if (commentContents === "") {
      Swal.fire({
        icon: "warning",
        title: "내용을 입력해주세요",
      });

      return;
    }
    let body = {
      content: commentContents,
      commentType: "parent",
      userNickName: author,
    };
    setCommentList(commentList.concat(body));
    setCommentContents("");
    axios
      .post(
        "/comment/" + id,
        {
          postCategory: commentPageType,
          content: commentContents,
          responseTo: responseTo,
          commentType: "parent",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  const onPaginationClick = (e) => {
    window.scrollTo(0, 0);
    setImages([]);
    setCommentList([]);
    axios
      .get("/recommend-posts/comments/" + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        // commentList 초기화 및 get 해온 댓글, 대댓글 추가
        if (commentList.length === 0) {
          setCommentList(commentList.concat(res.data));
        }
      })
      .catch((err) => console.log(err));
  };

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
          <div>{showDeleteButton()}</div>
          <span className="bestPostView-title">{best.title}</span>
          <div className="bestPostView-subtitle">
            <span>{String(best.createdDate).substr(0, 10) + "  "}</span>

            <span>
              {String(best.createdDate).substr(11, 12).split(":")[0] +
                ":" +
                String(best.createdDate).substr(11, 12).split(":")[1] +
                " / "}
            </span>
            <span>작성자: {best.author}</span>
          </div>
          <div style={{ width: "30px", height: "20px" }}></div>
          {images !== undefined ? showImages : null}
          <div style={{ width: "30px", height: "20px" }}></div>
          <div className="bestPostView-content">
            {String(best.content)
              .split("\n")
              .map((line) => {
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
          <div className="reply-id">{author}</div>
          <textarea
            className="reply-input"
            onChange={(e) => getValue(e)}
            type="text"
            value={commentContents}
          ></textarea>
          <div className="outreplybtn">
            <button className="replybtn" onClick={(e) => addComment(e)}>
              댓글 달기
            </button>
          </div>
          <div>{showComments}</div>
        </div>
        <div className="pagination-line"></div>
        <div className="pagination">
          <div className="pagination-title">이전 글 / 다음 글</div>
          <div className="pagination-pages">
            {postList
              ? postList.map((item, index) => {
                  return parseInt(item.id) === parseInt(best.id) ? (
                    <Link
                      to={`/bestPostView/${item.id}`}
                      style={{ textDecoration: "none", color: "#ffa800" }}
                      onClick={(e) => onPaginationClick(e)}
                    >
                      <div className="postlist" key={index}>
                        <div className="postlist-title">{item.title}</div>
                        <div className="postlist-date">
                          {String(item.createdDate).substr(0, 10)}
                          <span>
                            &nbsp;
                            {String(best.createdDate)
                              .substr(11, 12)
                              .split(":")[0] +
                              ":" +
                              String(best.createdDate)
                                .substr(11, 12)
                                .split(":")[1]}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to={`/bestPostView/${item.id}`}
                      style={{ textDecoration: "none", color: "#443333" }}
                      onClick={(e) => onPaginationClick(e)}
                    >
                      <div className="postlist" key={index}>
                        <div className="postlist-title">{item.title}</div>
                        <div className="postlist-date">
                          {String(item.createdDate).substr(0, 10)}
                          <span>
                            &nbsp;
                            {String(item.createdDate)
                              .substr(11, 12)
                              .split(":")[0] +
                              ":" +
                              String(item.createdDate)
                                .substr(11, 12)
                                .split(":")[1]}
                          </span>
                        </div>
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
