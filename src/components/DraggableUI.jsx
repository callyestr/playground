import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from 'react';

const DraggableUI = ({ children, initialPosition, id, allElements, onPositionChange }) => {
  // 랜덤 회전 각도 생성 (초기 렌더링 시 한 번만 실행)
  const initialRotation = useRef(Math.floor(Math.random() * 30) - 15);
  const [rotation, setRotation] = useState(initialRotation.current);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

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

  // 초기 애니메이션 효과
  useEffect(() => {
    // 약간의 랜덤 지연 시간 추가 (0~500ms)
    const animationDelay = Math.random() * 500;
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800 + animationDelay);
    
    // 초기 위치에서 겹치지 않는 랜덤 위치 찾기
    const findNonOverlappingPosition = () => {
      // 최대 시도 횟수 제한
      const maxAttempts = 20;
      let attempts = 0;
      
      // 초기 위치 저장
      const originalPosition = { ...initialPosition };
      
      while (attempts < maxAttempts) {
        // 랜덤 오프셋 생성 (더 넓은 범위로 설정)
        const randomOffsetX = Math.random() * 100 - 50;
        const randomOffsetY = Math.random() * 100 - 50;
        
        const newPosition = {
          x: originalPosition.x + randomOffsetX,
          y: originalPosition.y + randomOffsetY
        };
        
        // 화면 경계 체크
        if (
          newPosition.x < 0 ||
          newPosition.y < 0 ||
          newPosition.x + uiElementWidth > window.innerWidth ||
          newPosition.y + uiElementHeight > window.innerHeight
        ) {
          attempts++;
          continue;
        }
        
        // 중앙 이미지와 충돌 체크
        if (checkCenterImageCollision(newPosition)) {
          attempts++;
          continue;
        }
        
        // 겹침 검사
        if (checkOverlap(newPosition)) {
          // 겹치지 않는 위치 찾음
          setPosition(newPosition);
          // 위치 변경 알림
          onPositionChange(id, newPosition);
          return;
        }
        
        attempts++;
      }
      
      // 모든 시도 후에도 겹치지 않는 위치를 찾지 못한 경우 원래 위치 사용
      setPosition(originalPosition);
    };
    
    // 겹치지 않는 위치 찾기 실행
    findNonOverlappingPosition();
    
  }, []);

  // 드래그 시작
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    
    // 드래그 시작할 때 회전 각도를 0으로 설정하여 사용성 향상
    setRotation(0);
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
    const isOverCenter = checkCenterImageCollision(newPosition);
    
    // 겹침 검사를 통과한 경우에만 위치 업데이트
    if (checkOverlap(newPosition)) {
      setPosition(newPosition);
      onPositionChange(id, newPosition);
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // 드래그 종료 시 중앙 영역에 있는지 확인하고 모달 표시
    if (checkCenterImageCollision(position)) {
      setShowModal(true);
    } else {
      // 드래그 종료 시 약간의 랜덤 회전 각도 적용 (중앙 영역이 아닌 경우에만)
      setRotation(Math.floor(Math.random() * 20) - 10);
    }
  };

  // 클릭 이벤트 처리
  const handleClick = () => {
    setShowModal(true);
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
        onClick={handleClick}
        sx={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          zIndex: isDragging ? 1001 : 1000,
          outline: 'none',
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          transition: isAnimating 
            ? 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            : isDragging 
              ? 'none' 
              : 'transform 0.3s ease-out, border 0.2s, box-shadow 0.2s',
          '&:focus': {
            outline: 'none'
          },
          // 중앙 영역에 있을 때 시각적 표시 추가
          border: checkCenterImageCollision(position) ? '2px solid #2196f3' : 'none',
          boxShadow: checkCenterImageCollision(position) 
            ? '0 0 10px rgba(33, 150, 243, 0.5)' 
            : '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
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