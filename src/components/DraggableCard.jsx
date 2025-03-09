import { useState } from 'react';
import Draggable from 'react-draggable';
import { Paper, Typography, Box } from '@mui/material';

const DraggableCard = ({ id, title, content, initialPosition, color, onDragStop }) => {
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
  
  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      onStart={handleStart}
      onStop={handleStop}
      bounds="parent"
    >
      <Paper
        elevation={isDragging ? 8 : 3}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
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
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
          },
          zIndex: isDragging ? 100 : 10,
        }}
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
    </Draggable>
  );
};

export default DraggableCard; 