import { useState } from 'react';
import Draggable from 'react-draggable';
import { Typography, Box } from '@mui/material';
import thumbnailSvg from '../assets/img_thumbnail.svg';

const DraggableCard = ({ id, title, content, initialPosition, color, onDragStop, svgPath }) => {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };
  
  const handleStart = () => {
    setIsDragging(true);
  };
  
  const handleStop = (e, data) => {
    setIsDragging(false);
    setPosition({ x: data.x, y: data.y });
    if (onDragStop) {
      onDragStop(id, { x: data.x, y: data.y });
    }
  };
  
  // 특정 ID(예: 1)를 가진 카드만 thumbnailSvg 사용
  const cardImage = id === 1 ? thumbnailSvg : svgPath;
  
  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      onStart={handleStart}
      onStop={handleStop}
      bounds="parent"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150px',
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          zIndex: isDragging ? 100 : 10,
        }}
      >
        <Box 
          component="img"
          src={cardImage}
          alt={title}
          sx={{ 
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            filter: isDragging ? 'drop-shadow(0 10px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))',
            transition: 'filter 0.3s ease',
            '&:hover': {
              filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.25))',
            },
          }}
        />
        <Box sx={{ 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 2,
          padding: 2
        }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2">
            {content}
          </Typography>
        </Box>
      </Box>
    </Draggable>
  );
};

export default DraggableCard; 