import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from 'react';

const DraggableUI = ({ children, initialPosition, id, allElements, onPositionChange, svgPath, centerImageSize, initialRotation }) => {
  // 랜덤 회전 각도 생성 (초기 렌더링 시 한 번만 실행)
  const defaultRotation = useRef(initialRotation || Math.floor(Math.random() * 60) - 30); // 더 큰 범위의 회전 각도 (-30도 ~ 30도)
  const [rotation, setRotation] = useState(defaultRotation.current);
  
  // UI 요소의 크기
  const uiElementWidth = 250;
  const uiElementHeight = 300;
  
  // 초기 위치 계산 (가장자리에서 시작)
  const getInitialEdgePosition = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 가장자리 영역 정의 (화면을 4개 구역으로 나눔)
    const edgeRegions = [
      // 상단 영역
      { 
        x: Math.random() * (screenWidth - 300) + 150, 
        y: 80 
      },
      // 우측 영역
      { 
        x: screenWidth - uiElementWidth - 80, 
        y: Math.random() * (screenHeight - 400) + 200 
      },
      // 하단 영역
      { 
        x: Math.random() * (screenWidth - 300) + 150, 
        y: screenHeight - uiElementHeight - 80 
      },
      // 좌측 영역
      { 
        x: 80, 
        y: Math.random() * (screenHeight - 400) + 200 
      }
    ];
    
    // ID에 따라 다른 가장자리 영역 선택 (균등하게 분배)
    const regionIndex = id % 4;
    return edgeRegions[regionIndex];
  };
  
  const [position, setPosition] = useState(getInitialEdgePosition());
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isOverCenter, setIsOverCenter] = useState(false);
  const elementRef = useRef(null);
  const [zIndex, setZIndex] = useState(1000); // z-index 상태 추가
  const [opacity, setOpacity] = useState(0); // 초기에는 투명하게 시작
  const [rotateAnimation, setRotateAnimation] = useState(false); // 회전 애니메이션 상태

  // UI 요소의 크기
  const minOverlapDistance = 30; // 최소 겹침 거리
  
  // 중앙 이미지 영역 정보
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const centerImageWidth = centerImageSize?.width || 500;
  const centerImageHeight = centerImageSize?.height || 500;

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
        // 드래그 중일 때는 겹침 허용 (위에 표시됨)
        if (isDragging) {
          continue;
        }
        
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
    // ID에 따라 다른 지연 시간 설정 (0~800ms)
    const staggerDelay = id * 120;
    const animationDelay = Math.random() * 200 + staggerDelay;
    
    // 초기에 투명도 0에서 시작하여 서서히 나타나도록
    setTimeout(() => {
      setOpacity(0.5);
      setTimeout(() => {
        setOpacity(1);
      }, 300);
    }, staggerDelay);
    
    // 초기 회전 각도 설정 (약간 더 회전된 상태에서 시작)
    const entryRotation = defaultRotation.current + (Math.random() > 0.5 ? 10 : -10);
    setRotation(entryRotation);
    
    // 애니메이션 종료 시간 설정
    setTimeout(() => {
      setIsAnimating(false);
      
      // 애니메이션 종료 후 원래 회전 각도로 돌아가는 효과
      setRotation(defaultRotation.current);
      setRotateAnimation(true);
      setTimeout(() => {
        setRotateAnimation(false);
      }, 400);
    }, 1000 + animationDelay);
    
    // 초기 위치에서 겹치지 않는 랜덤 위치 찾기
    const findNonOverlappingPosition = () => {
      // 화면 크기 계산
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // 화면 중앙
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
      
      // 가장자리 영역 정의 (화면을 4개 구역으로 나눔)
      const edgeRegions = [
        // 상단 영역
        { 
          x: Math.random() * (screenWidth - 300) + 150, 
          y: Math.random() * 120 + 100 
        },
        // 우측 영역
        { 
          x: screenWidth - Math.random() * 120 - uiElementWidth - 100, 
          y: Math.random() * (screenHeight - 400) + 200 
        },
        // 하단 영역
        { 
          x: Math.random() * (screenWidth - 300) + 150, 
          y: screenHeight - Math.random() * 120 - uiElementHeight - 100 
        },
        // 좌측 영역
        { 
          x: Math.random() * 120 + 100, 
          y: Math.random() * (screenHeight - 400) + 200 
        }
      ];
      
      // ID에 따라 다른 가장자리 영역 선택 (균등하게 분배)
      const regionIndex = id % 4;
      let newPosition = edgeRegions[regionIndex];
      
      // 추가 랜덤성 부여 (더 작은 범위로 조정)
      const jitter = 40; // 위치 변동 범위 축소
      newPosition.x += Math.random() * jitter * 2 - jitter;
      newPosition.y += Math.random() * jitter * 2 - jitter;
      
      // 화면 경계 체크 및 조정
      if (newPosition.x < 80) newPosition.x = 80;
      if (newPosition.y < 80) newPosition.y = 80;
      if (newPosition.x + uiElementWidth > screenWidth - 80) {
        newPosition.x = screenWidth - uiElementWidth - 80;
      }
      if (newPosition.y + uiElementHeight > screenHeight - 80) {
        newPosition.y = screenHeight - uiElementHeight - 80;
      }
      
      // 중앙 이미지와 충돌 체크
      if (checkCenterImageCollision(newPosition)) {
        // 중앙 이미지와 충돌하면 가장자리로 더 밀어냄
        const angle = Math.atan2(newPosition.y - centerY, newPosition.x - centerX);
        const pushDistance = 100;
        
        newPosition.x += Math.cos(angle) * pushDistance;
        newPosition.y += Math.sin(angle) * pushDistance;
        
        // 화면 경계 재확인
        if (newPosition.x < 80) newPosition.x = 80;
        if (newPosition.y < 80) newPosition.y = 80;
        if (newPosition.x + uiElementWidth > screenWidth - 80) {
          newPosition.x = screenWidth - uiElementWidth - 80;
        }
        if (newPosition.y + uiElementHeight > screenHeight - 80) {
          newPosition.y = screenHeight - uiElementHeight - 80;
        }
      }
      
      // 위치 설정 및 알림
      setTimeout(() => {
        setPosition(newPosition);
        onPositionChange(id, newPosition);
      }, staggerDelay);
    };
    
    // 겹치지 않는 위치 찾기 실행
    findNonOverlappingPosition();
    
    // 주기적으로 약간의 회전 효과 추가 (살아있는 느낌)
    const rotationInterval = setInterval(() => {
      if (!isDragging && !isOverCenter) {
        const smallRotation = Math.random() * 4 - 2; // -2도 ~ 2도 (더 작은 범위로 조정)
        setRotation(prev => prev + smallRotation);
      }
    }, 8000 + Math.random() * 4000); // 8~12초마다 (더 긴 간격으로 조정)
    
    return () => {
      clearInterval(rotationInterval);
    };
    
  }, []);

  // 드래그 시작 (마우스)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    
    // 드래그 시작할 때 회전 각도를 0으로 설정하여 사용성 향상
    setRotation(0);
    
    // 드래그 시작할 때 z-index 증가시켜 다른 요소들 위에 표시
    setZIndex(2000);
  };

  // 드래그 시작 (터치)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
      
      // 드래그 시작할 때 회전 각도를 0으로 설정
      setRotation(0);
      
      // 드래그 시작할 때 z-index 증가시켜 다른 요소들 위에 표시
      setZIndex(2000);
    }
  };

  // 드래그 중 (마우스)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };

    updatePosition(newPosition);
  };

  // 드래그 중 (터치)
  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const newPosition = {
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y,
    };

    updatePosition(newPosition);
  };

  // 위치 업데이트 공통 함수
  const updatePosition = (newPosition) => {
    // 화면 경계 체크
    if (
      newPosition.x < 0 ||
      newPosition.y < 0 ||
      newPosition.x + uiElementWidth > window.innerWidth ||
      newPosition.y + uiElementHeight > window.innerHeight
    ) {
      return;
    }

    // 중앙 이미지 영역과의 충돌 체크
    const isColliding = checkCenterImageCollision(newPosition);
    setIsOverCenter(isColliding);
    
    // 드래그 중에는 겹침 검사를 완화하여 자유롭게 이동 가능
    setPosition(newPosition);
    onPositionChange(id, newPosition);
  };

  // 드래그 종료 (마우스)
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    finishDrag();
  };

  // 드래그 종료 (터치)
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    finishDrag();
  };

  // 드래그 종료 공통 함수
  const finishDrag = () => {
    // 드래그 종료 시 중앙 영역에 있는지 확인하고 모달 표시
    if (isOverCenter) {
      // 중앙 이미지 위에 있을 때 회전 각도를 0으로 설정
      setRotation(0);
      
      // 중앙 이미지 위에 있을 때 약간의 애니메이션 효과 추가
      const targetX = centerImageSize?.centerX || centerX;
      const targetY = centerImageSize?.centerY || centerY;
      
      // 중앙 이미지 위에 자연스럽게 위치하도록 조정
      const adjustedX = targetX - uiElementWidth / 2;
      const adjustedY = targetY - uiElementHeight / 2;
      
      // 현재 위치에서 약간만 조정
      const newX = position.x + (adjustedX - position.x) * 0.2;
      const newY = position.y + (adjustedY - position.y) * 0.2;
      
      setPosition({ x: newX, y: newY });
      onPositionChange(id, { x: newX, y: newY });
      
      // 약간의 지연 후 모달 표시
      setTimeout(() => {
        setShowModal(true);
      }, 200);
    } else {
      // 드래그 종료 시 랜덤 회전 각도 적용 (중앙 영역이 아닌 경우에만)
      const randomRotation = Math.floor(Math.random() * 40) - 20; // -20도 ~ 20도
      setRotation(randomRotation);
      
      // 회전 애니메이션 효과 추가
      setRotateAnimation(true);
      setTimeout(() => {
        setRotateAnimation(false);
      }, 500);
    }
    
    // 중앙 영역 상태 초기화
    setIsOverCenter(false);
    
    // 드래그 종료 시 z-index 원복
    setTimeout(() => {
      setZIndex(1000);
    }, 300);
  };

  // 클릭 이벤트 처리
  const handleClick = () => {
    // 중앙 이미지 영역에 있을 때만 모달 표시
    if (checkCenterImageCollision(position)) {
      setShowModal(true);
    }
  };

  // 마우스 이벤트 리스너 등록/제거
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging]);

  // 터치 이벤트 기본 동작 방지
  useEffect(() => {
    const preventDefaultTouch = (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('touchmove', preventDefaultTouch);
      }
    };
  }, [isDragging]);

  return (
    <>
      <Box
        ref={elementRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        sx={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          zIndex: isDragging ? zIndex + id : zIndex,
          outline: 'none',
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          transition: isAnimating 
            ? 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), left 1s cubic-bezier(0.25, 0.1, 0.25, 1), top 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.6s ease-in' 
            : rotateAnimation
              ? 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
              : isDragging 
                ? 'none' 
                : 'transform 0.3s ease-out, left 0.3s ease-out, top 0.3s ease-out',
          width: 'auto',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // 중앙 영역 위에 있을 때 시각적 피드백
          opacity: isOverCenter ? 0.9 : opacity,
          filter: isOverCenter 
            ? 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.8))' 
            : 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.15))',
          touchAction: 'none', // 터치 기기에서 스크롤 방지
          '&:hover': {
            filter: 'brightness(1.05) drop-shadow(3px 5px 8px rgba(0, 0, 0, 0.2))',
            transform: `rotate(${rotation + 2}deg) scale(1.02)`,
            transition: 'transform 0.3s ease-out, filter 0.3s ease-out',
          },
        }}
      >
        {/* SVG 이미지만 표시 */}
        {svgPath && (
          <Box
            component="img"
            src={svgPath}
            alt={`UI Element ${id}`}
            sx={{
              width: 'auto',
              height: 'auto',
              maxWidth: '250px',
              maxHeight: '250px',
              objectFit: 'contain',
              transition: isDragging ? 'none' : 'transform 0.3s ease',
              transform: isOverCenter ? 'scale(1.05)' : 'scale(1)',
              pointerEvents: 'none', // 이미지가 드래그 이벤트를 방해하지 않도록
              filter: 'sepia(0.1)', // 약간의 빈티지 효과 추가
            }}
          />
        )}
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
            bgcolor: '#FFF9FA', // 메인 배경과 동일한 화이트톤
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 0 30px rgba(255, 157, 170, 0.1)',
            p: 4,
            backgroundImage: `
              linear-gradient(#FFE5E9 0.1em, transparent 0.1em),
              linear-gradient(90deg, #FFE5E9 0.1em, transparent 0.1em)
            `,
            backgroundSize: '1.8em 1.8em',
            backgroundPosition: '0 0, 0 0',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='800' height='800' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
              opacity: 0.7,
              pointerEvents: 'none',
              mixBlendMode: 'multiply',
              borderRadius: 'inherit',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 20%),
                radial-gradient(circle at 70% 65%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 20%),
                radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 20%),
                linear-gradient(45deg, rgba(0, 0, 0, 0.02) 0%, transparent 70%),
                linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 70%)
              `,
              pointerEvents: 'none',
              borderRadius: 'inherit',
            },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setShowModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#FF9DAA',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
            {/* 모달 내용 */}
            {children}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DraggableUI; 