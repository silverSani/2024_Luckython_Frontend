import React, { useEffect, useState } from 'react';
import '../../styles/OwnerPlaylist.css'; 
import '../../styles/Owner.css';
import '../../styles/Guest.css';
import Pin from "../../assets/soundpinLogo.png"
import api from "services/api"
import userImg from "../../assets/Me.png"
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdExitToApp } from "react-icons/md";
import axios from 'axios';

function Guest() {
  const [pinNumber, setPinNumber] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState('사용자 이름');
  const [playlist, setPlaylist] = useState({ title: '', id: '', isEditable: false }); 
  const [editedTitle, setEditedTitle] = useState('');
  const [userInfo, setUserInfo] = useState({username : '사니', pin : '202309'})
  const [songs, setSongs] = useState([]); // State to hold playlist items

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://3.36.76.110:8080/api/playlistItems/6',
      headers: {}
    };
  
    axios.request(config)
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
  }, []);

  // 플레이리스트 제목을 업데이트하는 함수
  const updatePlaylistTitle = () => {
    api.put(`/api/playlists/youtube/${playlist.id}`, { title: editedTitle })
      .then(response => {
        setIsEditing(false);
        setPlaylist((prev) => ({ ...prev, title: editedTitle }));
        console.log('플레이리스트 업데이트 완료:', response.data);
      })
      .catch(error => {
        console.error('플레이리스트 제목 업데이트 중 오류 발생:', error);
      });
  };

  // 플레이리스트의 수정 가능 여부를 변경하는 함수
  const toggleEditability = () => {
    api.patch(`/api/playlists/modify/${playlist.id}`, { isEditable: !playlist.isEditable })
      .then(response => {
        setPlaylist((prev) => ({ ...prev, isEditable: !prev.isEditable }));
        console.log('플레이리스트 수정 가능 상태 변경:', response.data);
      })
      .catch(error => {
        console.error('수정 가능 상태 변경 중 오류 발생:', error);
      });
  };

  // 플레이리스트 삭제 함수
  const deletePlaylist = () => {
    api.delete(`/api/playlists/${playlist.id}`)
      .then(response => {
        console.log('플레이리스트 삭제 완료:', response.data);
        setPlaylist({ title: '', id: '', isEditable: false }); // 플레이리스트 초기화
        setSelectedSongs([]); // 선택된 노래 초기화
      })
      .catch(error => {
        console.error('플레이리스트 삭제 중 오류 발생:', error);
      });
  };

  // 핀 번호 입력 핸들러
  const handleInputChange = (e) => {
    setPinNumber(e.target.value);
  };

  // Enter 키 눌림 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(`Searching for Pin: ${pinNumber}`);
    }
  };

  // 노래 선택 핸들러
  const handleSongSelection = (id) => {
    if (selectedSongs.includes(id)) {
      setSelectedSongs(selectedSongs.filter(songId => songId !== id));
    } else {
      setSelectedSongs([...selectedSongs, id]);
    }
  };

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    if (selectedSongs.length === songs.length) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(songs.map(song => song.id));
    }
  };

  const addPlaylistItem = () => {
    
  };

  const handleSave = () => {
    updatePlaylistTitle();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(playlist.title);
  };

  const toggleProfileEdit = () => {
    setIsProfileEditing(!isProfileEditing);
  };

  const handleProfileSave = () => {
    console.log('Saved profile name:', profileName);
    toggleProfileEdit();
  };

  const handleProfileCancel = () => {
    setProfileName('사용자 이름');
    toggleProfileEdit();
  };

  return (
    <div className="header">
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
        <MdExitToApp style={{ fontSize: '30px', cursor: 'pointer' }} />
      </div>
      <div className="ownerPlaylistContainer">
        <div className="playlistTitle">
          <div className='playlistHead'>
            <FaRegCirclePlay style={{ fontSize: '40px', marginTop: '-3px' }} />
            <h1 className="playlistName">{playlist.title || '플레이리스트 이름'}</h1>
          </div>
          <div className="playlist-cover">
            <div className='playlist'/>
           
           
           
            <div className="playlist-description">
              아이유, 태연, 볼빨간사춘기, 백예린, 약동무지개, 윤하 ...
            </div>
          </div>

          <div className="user-info-container">
            <div className='info-row'>
                <img src={userImg} alt="Playlist Cover" />
                <p style={{
                        fontFamily: 'Pretendard',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '15px',
                        letterSpacing : 2
                      }}>
                      { userInfo.username } / PIN : {userInfo.pin}
                </p>
              </div>
          </div>
        </div>

        <div className="columns">
          <div className="profile-edit">
              <>
              <div className = "row">
                  <button className="save-my-playlist-button">
                    <p style={{
                      fontFamily: 'Pretendard',
                      fontStyle: 'normal',
                      fontWeight: 550,
                      fontSize: '13px',
                      lineHeight: '19px',
                      textAlign: 'center'
                    }}>
                      내 Playlist에 저장
                    </p>
                  </button>
                  <button className="edit-button" onClick={addPlaylistItem}>
                  <p style={{
                      fontFamily: 'Pretendard',
                      fontStyle: 'normal',
                      fontWeight: 550,
                      fontSize: '13px',
                      lineHeight: '19px',
                      textAlign: 'center'
                    }}>
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
                    <input type="checkbox" 
                    checked={selectedSongs.includes(song.playlistItemId)} 
                    onChange={() => handleSongSelection(song.playlistItemId)} 
                    disabled={!isEditing}/>
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
