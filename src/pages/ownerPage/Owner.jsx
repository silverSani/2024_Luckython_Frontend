import { useEffect, useState } from 'react';
import '../../styles/Owner.css';
import api from "services/api";
import YouTube from "react-youtube";
import PinLogo from "../../assets/soundpinLogo.png";
import Me from '../../assets/Me.png';
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function Owner() {
  const options = {
    width: "300",
    height: "200",
    playerVars: { autoplay: 0 },
  };

  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [pinNumber, setPinNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('산이');
  const [editedName, setEditedName] = useState(profileName);
  const [description, setDescription] = useState('기분 전환을 위한 플레이리스트');
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: '/api/playlists',
      headers: {},
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
    const requestBody = {
      title: newPlaylistTitle,
      description: newPlaylistDescription,
      status: 'public',
    };

    api.post('/api/playlists', requestBody)
      .then(response => {
        setNewPlaylistTitle('');
        setNewPlaylistDescription('');
        setPlaylists(prev => [...prev, response.data]);
      })
      .catch(error => {
        if (error.response) {
          console.error('Error creating playlist:', error.response.data);
        } else {
          console.error('Error creating playlist:', error);
        }
      });
  };

  const handleInputChange = (event) => {
    setPinNumber(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log("Searching for PIN:", pinNumber);
    }
  };

  const handleIconClick = () => {
    navigate('/OwnerPlaylist');
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
    // Navigate to the OwnerPlaylist page, possibly passing the playlistId as a state
    navigate('/OwnerPlaylist', { state: { playlistId } });
  };

  return (
    <div className="header">
      <div className="header-container">
        <div className="logo">
          <img src={PinLogo} alt="Pin Logo" className="pinLogo" />
        </div>
        <input
          className="search-bar"
          type="text"
          placeholder="Search using Pin..."
          value={pinNumber}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FaUserGear style={{ fontSize: '30px', cursor: 'pointer' }} onClick={handleIconClick} />
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
              <div className='row'>
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
              src={playlist.imageUrl}
              alt={playlist.title}
              onClick={() => handleThumbnailClick(playlist.playlistId)} // Add click handler
            />
            <h3 className="playlist-name">{playlist.customTitle || playlist.title}</h3>
            {playlist.canModify}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Owner;
