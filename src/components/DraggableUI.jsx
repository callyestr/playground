import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

const DraggableUI = ({ children, initialPosition, id, allElements, onPositionChange }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);

  // UI 요소의 크기
  const uiElementWidth = 150;
  const uiElementHeight = 60;
  const minOverlapDistance = 30; // 최소 겹침 거리

  // 겹침 검사 함수
  const checkOverlap = (newPosition) => {
    // 현재 요소를 제외한 다른 모든 요소와의 겹침 검사
    for (const element of allElements) {
      if (element.id === id) continue;
      
      const elementPos = element.position;
      
      // 두 요소 간의 겹침 정도 계산
      const overlapX = Math.min(
        newPosition.x + uiElementWidth - elementPos.x,
        elementPos.x + uiElementWidth - newPosition.x
      );
      
      const overlapY = Math.min(
        newPosition.y + uiElementHeight - elementPos.y,
        elementPos.y + uiElementHeight - newPosition.y
      );

      // 두 요소가 겹치는지 확인
      if (overlapX > 0 && overlapY > 0) {
        // 겹침이 너무 많은 경우 (80% 이상) 이동 불가
        if (overlapX > uiElementWidth * 0.8 && overlapY > uiElementHeight * 0.8) {
          return false;
        }
        
        // 최소한의 겹침은 허용
        if (overlapX < minOverlapDistance || overlapY < minOverlapDistance) {
          continue;
        }
        
        return false;
      }
    }
    
    return true;
  };

  // 중앙 이미지 영역 체크
  const checkCenterImageCollision = (newPosition) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const centerImageWidth = 500; // 중앙 이미지의 너비
    const centerImageHeight = 500; // 중앙 이미지의 높이

    const centerImageBounds = {
      left: centerX - centerImageWidth / 2,
      right: centerX + centerImageWidth / 2,
      top: centerY - centerImageHeight / 2,
      bottom: centerY + centerImageHeight / 2,
    };

    return (
      newPosition.x < centerImageBounds.right &&
      newPosition.x + uiElementWidth > centerImageBounds.left &&
      newPosition.y < centerImageBounds.bottom &&
      newPosition.y + uiElementHeight > centerImageBounds.top
    );
  };

  // 드래그 시작
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };

    // 화면 경계 체크
    if (
      newPosition.x < 0 ||
      newPosition.y < 0 ||
      newPosition.x + uiElementWidth > window.innerWidth ||
      newPosition.y + uiElementHeight > window.innerHeight
    ) {
      return;
    }

    // 중앙 이미지와 충돌 체크
    if (checkCenterImageCollision(newPosition)) {
      setShowModal(true);
      setIsDragging(false);
      return;
    }

    // 겹침 검사를 통과한 경우에만 위치 업데이트
    if (checkOverlap(newPosition)) {
      setPosition(newPosition);
      onPositionChange(id, newPosition);
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 마우스 이벤트 리스너 등록/제거
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          zIndex: isDragging ? 1001 : 1000,
          outline: 'none',
          '&:focus': {
            outline: 'none'
          },
        }}
      >
        {children}
      </Box>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '60vw',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setShowModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ mt: 2 }}>
            {/* 모달 내용 */}
            {children}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DraggableUI; 