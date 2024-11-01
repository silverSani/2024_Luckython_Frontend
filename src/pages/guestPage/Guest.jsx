import React, { useEffect, useInsertionEffect, useState } from "react";
import "../../styles/OwnerPlaylist.css";
import "../../styles/Owner.css";
import "../../styles/Guest.css";
import Pin from "../../assets/soundpinLogo.png";
import api from "services/api";
import userImg from "../../assets/Me.png";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdExitToApp } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import AddMusic from "../guestPage/Item";
import YouTube from "react-youtube";

function Guest() {
  const [pinNumber, setPinNumber] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [editedTitle, setEditedTitle] = useState("");
  const [userInfo, setUserInfo] = useState({ username: "사니", pin: "202309" });
  const [songs, setSongs] = useState([]); // State to hold playlist items
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let config_item = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://3.36.76.110:8080/api/playlistItems/6",
      headers: {},
    };

    axios
      .request(config_item)
      .then((response) => {
        console.log(JSON.stringify(response.data));

        // 응답 데이터에서 dataList 배열을 가져오기
        const playlistName = response.data.dataList;
        if (Array.isArray(playlistName)) {
          setSongs(playlistName);
        } else {
          console.error("응답 데이터가 배열이 아닙니다:", playlistName);
          setSongs([]); // 배열이 아닌 경우 빈 배열로 초기화
        }
      })
      .catch((error) => {
        console.log("API 호출 중 오류 발생:", error);
      });

    let config_playlist = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://3.36.76.110:8080/api/playlists/6",
      headers: {},
    };

    axios
      .request(config_playlist)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setPlaylist(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // 플레이리스트 제목을 업데이트하는 함수
  const updatePlaylistTitle = () => {
    api
      .put(`/api/playlists/youtube/${playlist.id}`, { title: editedTitle })
      .then((response) => {
        setIsEditing(false);
        setPlaylist((prev) => ({ ...prev, title: editedTitle }));
        console.log("플레이리스트 업데이트 완료:", response.data);
      })
      .catch((error) => {
        console.error("플레이리스트 제목 업데이트 중 오류 발생:", error);
      });
  };

  // 플레이리스트의 수정 가능 여부를 변경하는 함수
  const toggleEditability = () => {
    api
      .patch(`/api/playlists/modify/${playlist.id}`, {
        isEditable: !playlist.isEditable,
      })
      .then((response) => {
        setPlaylist((prev) => ({ ...prev, isEditable: !prev.isEditable }));
        console.log("플레이리스트 수정 가능 상태 변경:", response.data);
      })
      .catch((error) => {
        console.error("수정 가능 상태 변경 중 오류 발생:", error);
      });
  };

  // 플레이리스트 삭제 함수
  const deletePlaylist = () => {
    api
      .delete(`/api/playlists/${playlist.id}`)
      .then((response) => {
        console.log("플레이리스트 삭제 완료:", response.data);
        setPlaylist({ title: "", id: "", isEditable: false }); // 플레이리스트 초기화
        setSelectedSongs([]); // 선택된 노래 초기화
      })
      .catch((error) => {
        console.error("플레이리스트 삭제 중 오류 발생:", error);
      });
  };

  // 핀 번호 입력 핸들러
  const handleInputChange = (e) => {
    setPinNumber(e.target.value);
  };

  // Enter 키 눌림 핸들러
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log(`Searching for Pin: ${pinNumber}`);
    }
  };

  // 노래 선택 핸들러
  const handleSongSelection = (id) => {
    if (selectedSongs.includes(id)) {
      setSelectedSongs(selectedSongs.filter((songId) => songId !== id));
    } else {
      setSelectedSongs([...selectedSongs, id]);
    }
  };

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    if (selectedSongs.length === songs.length) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(songs.map((song) => song.id));
    }
  };

  const addPlaylistItem = () => {
      localStorage.setItem("len", songs.length - 1);
    navigate("/Item");
    
  };

  const handleSave = () => {
    updatePlaylistTitle();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(playlist.title);
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < songs.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1); 
    } else {
      setCurrentVideoIndex(0); 
    }
  };

  const VideoPlayer = ({ videoId }) => {
    const options = {
      width: "400",
      height: "300",
      playerVars: {
        autoplay: 1,
      },
    };

    return <YouTube videoId={videoId} opts={options} onEnd={handleVideoEnd} />;
  };


  return (
    <div className="header">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Music Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <AddMusic closeModal={closeModal} /> {/* 모달 닫기 함수 전달 */}
      </Modal>
      <div className="header-container">
        <h1 className="logo">
          <span className="pinLogoContainer">
            <img className="pinLogo" src={Pin} alt="pinLogo" />
          </span>
        </h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search using Pin..."
          value={pinNumber}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <MdExitToApp style={{ fontSize: "30px", cursor: "pointer" }} />
      </div>
      <div className="ownerPlaylistContainer">
        <div className="playlistTitle">
          <div className="playlistHead">
            <FaRegCirclePlay style={{ fontSize: "40px", marginTop: "-3px" }} />
            <h1 className="playlistName">
              {playlist.title || "플레이리스트 이름"}
            </h1>
          </div>
          <div className="playlist-cover">
            <div className="playlist">
              {songs.length > 0 && (
                <VideoPlayer videoId={songs[currentVideoIndex].videoId} />
              )}
            </div>

            <div className="playlist-description">
              <p
                style={{
                  fontFamily: "Pretendard",
                  fontStyle: "normal",
                  fontWeight: 550,
                  fontSize: "25px",
                  lineHeight: "50px",
                  textAlign: "center",
                }}
              >
                {playlist.description || "플레이리스트 설명"}
              </p>
            </div>
          </div>

          <div className="user-info-container">
            <div className="info-row">
              <img src={userImg} alt="Playlist Cover" />
              <p
                style={{
                  fontFamily: "Pretendard",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "15px",
                  letterSpacing: 2,
                }}
              >
                {userInfo.username} / PIN : {userInfo.pin}
              </p>
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="profile-edit">
            <>
              <div className="row">
                <button className="save-my-playlist-button">
                  <p
                    style={{
                      fontFamily: "Pretendard",
                      fontStyle: "normal",
                      fontWeight: 550,
                      fontSize: "13px",
                      lineHeight: "19px",
                      textAlign: "center",
                    }}
                  >
                    내 Playlist에 저장
                  </p>
                </button>
                <button className="edit-button" onClick={openModal}>
                  <p
                    style={{
                      fontFamily: "Pretendard",
                      fontStyle: "normal",
                      fontWeight: 550,
                      fontSize: "13px",
                      lineHeight: "19px",
                      textAlign: "center",
                    }}
                  >
                    음원 추가
                  </p>
                </button>
              </div>
            </>
          </div>
          <table className="songs-table">
            <thead>
              <tr>
                <th>
                  <input
                    className="check"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedSongs.length === songs.length}
                  />
                </th>
                <th>Title</th>
                <th>Channel</th>
                <th>Like</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.playlistItemId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.playlistItemId)}
                      onChange={() => handleSongSelection(song.playlistItemId)}
                      disabled={!isEditing}
                    />
                  </td>
                  <td>{song.videoTitle}</td>
                  <td>{song.videoOwnerChannelTitle}</td>
                  <td>♡{song.like}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Guest;



// import React, { useEffect, useState } from "react";
// import "../../styles/OwnerPlaylist.css";
// import "../../styles/Owner.css";
// import "../../styles/Guest.css";
// import Pin from "../../assets/soundpinLogo.png";
// import userImg from "../../assets/Me.png";
// import { FaRegCirclePlay } from "react-icons/fa6";
// import { MdExitToApp } from "react-icons/md";
// import axios from 'axios';
// import YouTube from 'react-youtube';
// import { useNavigate, useLocation } from "react-router-dom";
// import Modal from "react-modal";
// import AddMusic from "../guestPage/Item";
// import Loading from "../guestPage/loading"; // 로딩 컴포넌트 추가

// function Guest() {
//   const [pinNumber, setPinNumber] = useState("");
//   const [selectedSongs, setSelectedSongs] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [playlist, setPlaylist] = useState({ title: "", description: "" });
//   const [editedTitle, setEditedTitle] = useState("");
//   const [songs, setSongs] = useState([]);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [isProfileEditing, setIsProfileEditing] = useState(false);
//   const [profileName, setProfileName] = useState("사용자 이름");
//   const [userInfo, setUserInfo] = useState({ username: "사니", pin: "" });
//   const [isLoaded, setIsLoaded] = useState(false);
//   const location = useLocation();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const navigate = useNavigate();

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const pin = queryParams.get("pin");

//     if (pin) {
//       setPinNumber(pin);
//       setUserInfo((prev) => ({ ...prev, pin }));

//       // Fetch playlist data based on PIN
//       axios
//         .get(`http://3.36.76.110:8080/api/playlists/${pin}`)
//         .then((response) => {
//           const playlistData = response.data.data;
//           setPlaylist(playlistData);
//           setEditedTitle(playlistData.title);
//         })
//         .catch((error) => {
//           console.error("Error fetching playlist:", error);
//         });

//       // Fetch songs for the playlist
//       axios
//         .get(`http://3.36.76.110:8080/api/playlistItems/${pin}`)
//         .then((response) => {
//           const songsData = response.data.dataList;
//           setSongs(songsData);
//           setIsLoaded(true);
//         })
//         .catch((error) => {
//           console.error("Error loading songs:", error);
//           setIsLoaded(false);
//         });
//     }
//   }, [location.search]);

//   const updatePlaylistTitle = () => {
//     axios
//       .put(`/api/playlists/youtube/${playlist.id}`, { title: editedTitle })
//       .then((response) => {
//         setIsEditing(false);
//         setPlaylist((prev) => ({ ...prev, title: editedTitle }));
//       })
//       .catch((error) => {
//         console.error("Error updating playlist title:", error);
//       });
//   };

//   const toggleEditability = () => {
//     axios
//       .patch(`/api/playlists/modify/${playlist.id}`, {
//         isEditable: !playlist.isEditable,
//       })
//       .then((response) => {
//         setPlaylist((prev) => ({ ...prev, isEditable: !prev.isEditable }));
//       })
//       .catch((error) => {
//         console.error("Error toggling editability:", error);
//       });
//   };

//   const deletePlaylist = () => {
//     axios
//       .delete(`/api/playlists/${playlist.id}`)
//       .then(() => {
//         setPlaylist({ title: "", id: "", isEditable: false });
//         setSelectedSongs([]);
//       })
//       .catch((error) => {
//         console.error("Error deleting playlist:", error);
//       });
//   };

//   const handleInputChange = (e) => setPinNumber(e.target.value);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       // Implement any additional logic if needed
//     }
//   };

//   const handleSongSelection = (id) => {
//     setSelectedSongs((prev) =>
//       prev.includes(id)
//         ? prev.filter((songId) => songId !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedSongs.length === songs.length) {
//       setSelectedSongs([]);
//     } else {
//       setSelectedSongs(songs.map((song) => song.playlistItemId));
//     }
//   };

//   const handleVideoEnd = () => {
//     setCurrentVideoIndex((prev) =>
//       prev < songs.length - 1 ? prev + 1 : 0
//     );
//   };

//   const VideoPlayer = ({ videoId }) => {
//     const options = {
//       width: "400",
//       height: "300",
//       playerVars: { autoplay: 1 },
//     };

//     return <YouTube videoId={videoId} opts={options} onEnd={handleVideoEnd} />;
//   };

//   return (
//     <div className="header">
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         contentLabel="Add Music Modal"
//         className="modal"
//         overlayClassName="modal-overlay"
//       >
//         <AddMusic closeModal={closeModal} />
//       </Modal>
//       <div className="header-container">
//         <h1 className="logo">
//           <span className="pinLogoContainer">
//             <img className="pinLogo" src={Pin} alt="pinLogo" />
//           </span>
//         </h1>
//         <input
//           className="search-bar"
//           type="text"
//           placeholder="Search using Pin..."
//           value={pinNumber}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//         />
//         <MdExitToApp style={{ fontSize: "30px", cursor: "pointer" }} />
//       </div>

//       {isLoaded ? (
//         <div className="ownerPlaylistContainer">
//           <div className="playlistTitle">
//             <div className="playlistHead">
//               <FaRegCirclePlay style={{ fontSize: "40px", marginTop: "-3px" }} />
//               <h1 className="playlistName">{playlist.title || "플레이리스트 이름"}</h1>
//             </div>

//             <div className="playlist-cover">
//               <div className="playlist">
//                 {songs.length > 0 && <VideoPlayer videoId={songs[currentVideoIndex].videoId} />}
//               </div>
//               <div className="playlist-description">
//                 <p
//                   style={{
//                     fontFamily: "Pretendard",
//                     fontStyle: "normal",
//                     fontWeight: 550,
//                     fontSize: "25px",
//                     lineHeight: "50px",
//                     textAlign: "center",
//                   }}
//                 >
//                   {playlist.description || "플레이리스트 설명"}
//                 </p>
//               </div>
//             </div>

//             <div className="user-info-container">
//               <div className="info-row">
//                 <img src={userImg} alt="User" />
//                 <p
//                   style={{
//                     fontFamily: "Pretendard",
//                     fontStyle: "normal",
//                     fontWeight: 500,
//                     fontSize: "15px",
//                     letterSpacing: 2,
//                   }}
//                 >
//                   {userInfo.username} / PIN : {userInfo.pin}
//                 </p>
//               </div>
//             </div>

//             <div className="columns">
//               <table className="songs-table">
//                 <thead>
//                   <tr>
//                     <th>
//                       <input
//                         className="check"
//                         type="checkbox"
//                         onChange={handleSelectAll}
//                         checked={selectedSongs.length === songs.length}
//                       />
//                     </th>
//                     <th>Title</th>
//                     <th>Channel</th>
//                     <th>Like</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {songs.map((song) => (
//                     <tr key={song.playlistItemId}>
//                       <td>
//                         <input
//                           type="checkbox"
//                           checked={selectedSongs.includes(song.playlistItemId)}
//                           onChange={() => handleSongSelection(song.playlistItemId)}
//                         />
//                       </td>
//                       <td>{song.videoTitle}</td>
//                       <td>{song.videoOwnerChannelTitle}</td>
//                       <td>{song.likeCount}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="edit-buttons">
//             <button onClick={() => setIsEditing(!isEditing)}>
//               {isEditing ? "Cancel" : "Edit Playlist Title"}
//             </button>
//             {isEditing && (
//               <div>
//                 <input
//                   value={editedTitle}
//                   onChange={(e) => setEditedTitle(e.target.value)}
//                 />
//                 <button onClick={updatePlaylistTitle}>Save</button>
//               </div>
//             )}
//             <button onClick={toggleEditability}>
//               {playlist.isEditable ? "Disable Edit" : "Enable Edit"}
//             </button>
//             <button onClick={deletePlaylist}>Delete Playlist</button>
//           </div>
//         </div>
//       ) : (
//         <Loading />
//       )}
//     </div>
//   );
// }

// export default Guest;