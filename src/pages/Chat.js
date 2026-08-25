import React, { useState, useEffect, useRef } from 'react';
import { Input, Avatar, Badge, Button } from 'antd';
import { SearchOutlined, SendOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import axios from 'axios';
import '../App.css';

// --- CẤU HÌNH ---
const SOCKET_SERVER_URL = 'http://localhost:3001';
const MOCK_API_URL = 'https://69ecd2ecaf4ff533142b6c82.mockapi.io/messages';

// --- DANH SÁCH NGƯỜI CHAT GIẢ ---
const FAKE_CONVERSATIONS = [
  { id: 'user_1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1', online: true },
  { id: 'user_2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=2', online: false },
  { id: 'user_3', name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?u=3', online: true },
];

function Chat() {
  const [conversations] = useState(FAKE_CONVERSATIONS);
  const [selectedChat, setSelectedChat] = useState(FAKE_CONVERSATIONS[0]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false); 

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); 

  // ==========================================
  // 1. KẾT NỐI SOCKET & LẮNG NGHE TIN NHẮN MỚI
  // ==========================================
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

    socketRef.current.on('receive_message', (data) => {
      console.log("📩 Nhận tin nhắn real-time:", data);
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // ==========================================
  // 2. TẢI LỊCH SỬ TỪ MOCKAPI KHI CHỌN PHÒNG CHAT
  // ==========================================
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${MOCK_API_URL}?roomId=${selectedChat.id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
        setMessages([]);
      }
    };
    fetchHistory();
  }, [selectedChat]);

  // ==========================================
  // 3. TỰ ĐỘNG CUỘN XUỐNG
  // ==========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (isMobileView) setShowChat(true);
  };

  // ==========================================
  // 4. GỬI TIN NHẮN (QTY SOCKET)
  // ==========================================
  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      roomId: selectedChat.id,
      senderId: 'me',
      text: inputValue,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    // Phát lên Socket Server
    socketRef.current.emit('send_message', newMsg);

    // Hiện ngay trên màn hình của mình
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
  };

  // ==========================================
  // GIAO DIỆN (UI)
  // ==========================================
  return (
    <div className="chat-container">
      
      <div className="chat-sidebar" style={{ display: isMobileView && showChat ? 'none' : 'flex' }}>
        <div className="chat-sidebar-header"><h2>Đoạn chat</h2></div>
        <div style={{ padding: '0 12px' }}>
          <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." style={{ borderRadius: 20, marginBottom: 10 }}/>
        </div>
        <div className="chat-list">
          {conversations.map(chat => (
            <div key={chat.id} className={`chat-item ${selectedChat.id === chat.id ? 'chat-item-active' : ''}`} onClick={() => handleSelectChat(chat)}>
              <Badge dot={chat.online} color="green" offset={[-5, 35]} size="large"><Avatar size={48} src={chat.avatar} /></Badge>
              <div className="chat-item-info">
                <div className="chat-item-name">{chat.name}</div>
                <div className="chat-item-msg">Nhắn tin ngay...</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window" style={{ display: isMobileView && !showChat ? 'none' : 'flex' }}>
        <div className="chat-header">
          {isMobileView && (<Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setShowChat(false)} style={{ marginRight: 10, color: 'white' }}/>)}
          <Avatar src={selectedChat.avatar} />
          <div style={{ marginLeft: 12 }}>
            <div style={{ color: 'white', fontWeight: 'bold' }}>{selectedChat.name}</div>
            <div style={{ color: '#ddd', fontSize: 12 }}>{selectedChat.online ? 'Đang hoạt động' : 'Không hoạt động'}</div>
          </div>
        </div>

        <div className="chat-message-area">
          {messages.length === 0 && (<div style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>Chưa có tin nhắn nào. Hãy nói xin chào! 👋</div> )}
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message-bubble ${msg.senderId === 'me' ? 'chat-message-mine' : 'chat-message-other'}`}>
              {msg.text}
              <div className={msg.senderId === 'me' ? 'chat-message-time-mine' : 'chat-message-time-other'}>{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onPressEnter={handleSend} placeholder="Aa..." style={{ borderRadius: 20, padding: '8px 16px' }}/>
          <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSend} style={{ marginLeft: 10 }}/>
        </div>
      </div>
    </div>
  );
}

export default Chat;