import { useEffect, useState } from 'react';
import '../../styles/Owner.css';
import api from "services/api";
import axios from 'axios'; // axios import 추가
import Pin from "../../assets/soundpinLogo.png";
import Me from '../../assets/Me.png';
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function Owner() {
  const [playlists, setPlaylists] = useState([]);
  const [pinNumber, setPinNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('산이');
  const [editedName, setEditedName] = useState(profileName);
  const [description, setDescription] = useState('기분 전환을 위한 플레이리스트');
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      method: 'get',
      url: '/api/playlists',
    };

    api.request(config)
      .then((response) => {
        const data = response.data;
        console.log("API 응답:", data);
        setPlaylists(Array.isArray(data.dataList) ? data.dataList : []);
      })
      .catch((error) => {
        console.error('플레이리스트를 불러오는 중 오류 발생:', error);
      });
  }, []);

  const createPlaylist = () => {
    const data = JSON.stringify({
      title: "[PIN] public",
      description: "description",
      status: "public"
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://3.36.76.110:8080/api/playlists',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    return axios.request(config)
      .then((response) => {
        console.log("플레이리스트 생성 성공:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("플레이리스트 생성 중 오류:", error);
        return null;
      });
  };

  const addNewCard = async () => {
    const newPlaylistData = await createPlaylist();
    if (newPlaylistData) {
      const newPlaylist = {
        title: newPlaylistData.title,
        description: newPlaylistData.description,
        imageUrl: 'https://via.placeholder.com/150',
        videoId: ''
      };
      setPlaylists([...playlists, newPlaylist]);
    }
  };

  const handleInputChange = (event) => {
    setPinNumber(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log("Searching for PIN:", pinNumber);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditedName(profileName);
  };

  const handleSave = () => {
    setProfileName(editedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(profileName);
    setIsEditing(false);
  };

  const handleThumbnailClick = (playlistId) => {
    navigate('/OwnerPlaylist', { state: { playlistId } });
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
        <FaUserGear style={{ fontSize: '30px', cursor: 'pointer' }} />
      </div>

      <div className="profile-container">
        <img className="profile-image" src={Me} alt="Profile" />
        <div className="profile-column">
          {isEditing ? (
            <div className="profile-edit">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="edit"
              />
              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <button className="edit-button" onClick={handleCancel}>취소</button>
                <button className="edit-button" onClick={handleSave}>저장</button>
              </div>
            </div>
          ) : (
            <div className="profile-edit">
              <h2 className="profile-name">{profileName}</h2>
              <p className="bio">{description}</p>
              <button className="edit-button" onClick={toggleEdit}>수정</button>
            </div>
          )}
        </div>
      </div>

      <div className="playlist-container">
        {playlists.map((playlist, index) => (
          <div className="playlist-card" key={index}>
            <img
              className="playlist-thumbnail"
              src={playlist.imageUrl || 'https://via.placeholder.com/150'}
              alt={playlist.title}
              onClick={() => handleThumbnailClick(playlist.playlistId)}
            />
            <h3 className="playlist-name">{playlist.customTitle || playlist.title}</h3>
            {playlist.canModify && <div className="modify-badge">수정 가능</div>}
          </div>
        ))}
        <div className="playlist-card add-card" onClick={addNewCard}>
          <div className="add-icon">+</div>
        </div>
      </div>
    </div>
  );
}

export default Owner;
