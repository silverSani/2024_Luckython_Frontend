import React, { useEffect, useState } from 'react';
import '../../styles/OwnerPlaylist.css'; 
import '../../styles/Owner.css';
import Pin from "../../assets/pin1.png";
import axios from 'axios';
import api from "services/api";
import { FaUserGear, FaRegCirclePlay } from "react-icons/fa6";

function OwnerPlaylist() {
  const [pinNumber, setPinNumber] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState('사용자 이름');
  const [playlist, setPlaylist] = useState({ title: '', id: '', isEditable: false }); 
  const [editedTitle, setEditedTitle] = useState('');
  const [songs, setSongs] = useState([]); // State to hold playlist items

  // 플레이리스트 데이터를 API로부터 가져오는 함수 
  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://3.36.76.110:8080/api/playlistItems/5',
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  });

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
        setSongs([]); // 노래 초기화
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
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
          SoundP<span className="pinLogoContainer"><img className="pinLogo" src={Pin} alt="pinLogo" /></span>n
        </h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search using Pin..."
          value={pinNumber}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FaUserGear style={{ fontSize: '30px', cursor: 'pointer' }} />
      </div>
      <div className="ownerPlaylistContainer">
        <div className="playlistTitle">
          <div className='playlistHead'>
            <FaRegCirclePlay style={{ fontSize: '40px', marginTop: '-3px' }} />
            <h1 className="playlistName">{playlist.title || '플레이리스트 이름'}</h1>
          </div>
          <div className="playlist-cover">
            <img src="https://via.placeholder.com/150" alt="Playlist Cover" />
            <div className="playlist-description">
              아이유, 태연, 볼빨간사춘기, 백예린, 약동무지개, 윤하 ...
            </div>
          </div>

          <div className="ChangeBtn">
            {isProfileEditing ? (
              <>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="프로필 이름 입력"
                />
                <div className='row'>
                  <button className="edit-button" onClick={handleProfileSave}>저장</button>
                  <button className="edit-button" onClick={handleProfileCancel}>취소</button>
                </div>
              </>
            ) : (
              <button className="edit-button" onClick={toggleProfileEdit}>수정하기</button>
            )}
          </div>
        </div>

        <div className="columns">
          <div className="profile-edit">
            {isEditing ? (
              <div className='row'>
                <button className="edit-button" onClick={handleSave}>저장</button>
                <button className="edit-button" onClick={handleCancel}>취소</button>
              </div>
            ) : (
              <>
                <button className="edit-button" onClick={toggleEdit}>
                  재생목록 편집
                </button>
              </>
            )}
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
                <th>재생목록</th>
                <th>아티스트</th>
                <th>좋아요</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={() => handleSongSelection(song.id)}
                      disabled={!isEditing}
                    />
                  </td>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>♡{song.likes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerPlaylist;
