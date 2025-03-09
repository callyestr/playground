import { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';

const CustomDraggableCard = ({ id, title, content, initialPosition, color }) => {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const cardStartPos = useRef({ ...position });
  
  // 화면 중앙 위치 계산
  const [centerPosition, setCenterPosition] = useState({ x: 0, y: 0 });
  
  // initialPosition이 변경될 때 position 상태 업데이트
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      cardStartPos.current = { ...initialPosition };
    }
  }, [initialPosition]);
  
  useEffect(() => {
    // 화면 중앙 위치 계산
    const updateCenterPosition = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setCenterPosition({ x: centerX, y: centerY });
    };
    
    // 초기 위치 설정 및 윈도우 리사이즈 이벤트 리스너 등록
    updateCenterPosition();
    window.addEventListener('resize', updateCenterPosition);
    
    return () => {
      window.removeEventListener('resize', updateCenterPosition);
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    cardStartPos.current = { ...position };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 드래그 중 텍스트 선택 방지
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    
    setPosition({
      x: cardStartPos.current.x + dx,
      y: cardStartPos.current.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 중앙 이미지 근처에 카드가 있는지 확인
    const cardCenterX = position.x + 75; // 카드 너비의 절반
    const cardCenterY = position.y + 75; // 카드 높이의 절반
    
    // 중앙 이미지 영역 정의 (중앙 이미지 주변 100px 영역)
    const centerImageArea = {
      left: centerPosition.x - 250,
      right: centerPosition.x + 250,
      top: centerPosition.y - 250,
      bottom: centerPosition.y + 250
    };
    
    // 카드가 중앙 이미지 영역 안에 있는지 확인
    const isNearCenter = 
      cardCenterX > centerImageArea.left && 
      cardCenterX < centerImageArea.right && 
      cardCenterY > centerImageArea.top && 
      cardCenterY < centerImageArea.bottom;
    
    // 중앙 이미지 영역 안에 있으면 시각적 효과 추가 (여기서는 생략)
    console.log(`카드 ${id}가 중앙 이미지 근처에 ${isNearCenter ? '있습니다' : '없습니다'}`);
  };

  // 카드 위치 계산 (화면 중앙 기준)
  const cardStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: `translate(${position.x}px, ${position.y}px)`,
    width: '150px',
    height: '150px',
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: color || '#ffffff',
    boxShadow: isDragging 
      ? '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' 
      : '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '10px',
    userSelect: 'none',
    transition: isDragging ? 'none' : 'box-shadow 0.3s ease, transform 0.2s ease',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
    zIndex: isDragging ? 100 : 10,
  };

  return (
    <Paper
      ref={cardRef}
      elevation={isDragging ? 8 : 3}
      sx={cardStyle}
      onMouseDown={handleMouseDown}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2">
          {content}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CustomDraggableCard; 