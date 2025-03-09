import { Box, CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import imgCenter from '../assets/img_center.svg';
import DraggableUI from './DraggableUI';

const MainLayout = () => {
  const [uiElements, setUiElements] = useState([]);
  const [centerImageSize, setCenterImageSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    // 중앙 이미지 크기 계산 (예상치로 시작)
    const centerWidth = 500;
    const centerHeight = 500;
    setCenterImageSize({ width: centerWidth, height: centerHeight });

    // UI 요소의 크기 (대략적인 값)
    const uiElementWidth = 150;
    const uiElementHeight = 60;
    const uiElementPadding = 20; // 요소 간 최소 간격

    // 이미 배치된 요소들의 위치와 겹침 카운트를 저장할 배열
    const placedElements = [];
    // 위치별 겹침 카운트를 저장할 맵
    const overlapCountMap = new Map();

    // 중앙 영역을 피해 랜덤 위치 생성 함수
    const getRandomPosition = () => {
      const padding = 100; // 화면 가장자리와의 최소 거리
      const centerPadding = 50; // 중앙 이미지와의 추가 여백
      
      // 화면 중앙
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // 중앙 이미지가 차지하는 영역
      const safeZoneLeft = centerX - (centerWidth / 2) - centerPadding;
      const safeZoneRight = centerX + (centerWidth / 2) + centerPadding;
      const safeZoneTop = centerY - (centerHeight / 2) - centerPadding;
      const safeZoneBottom = centerY + (centerHeight / 2) + centerPadding;
      
      // 최대 시도 횟수
      const maxAttempts = 50;
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        attempts++;
        
        // 화면을 4개 구역으로 나누고 랜덤하게 하나 선택
        const quadrant = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(quadrant) {
          case 0: // 좌상단
            x = Math.random() * (safeZoneLeft - padding - uiElementWidth) + padding;
            y = Math.random() * (safeZoneTop - padding - uiElementHeight) + padding;
            break;
          case 1: // 우상단
            x = Math.random() * (window.innerWidth - safeZoneRight - padding - uiElementWidth) + safeZoneRight;
            y = Math.random() * (safeZoneTop - padding - uiElementHeight) + padding;
            break;
          case 2: // 좌하단
            x = Math.random() * (safeZoneLeft - padding - uiElementWidth) + padding;
            y = Math.random() * (window.innerHeight - safeZoneBottom - padding - uiElementHeight) + safeZoneBottom;
            break;
          case 3: // 우하단
            x = Math.random() * (window.innerWidth - safeZoneRight - padding - uiElementWidth) + safeZoneRight;
            y = Math.random() * (window.innerHeight - safeZoneBottom - padding - uiElementHeight) + safeZoneBottom;
            break;
        }
        
        // 각 요소마다 겹치는 요소 수 확인
        const overlappingElements = [];
        
        for (const element of placedElements) {
          if (
            x < element.x + uiElementWidth + uiElementPadding &&
            x + uiElementWidth + uiElementPadding > element.x &&
            y < element.y + uiElementHeight + uiElementPadding &&
            y + uiElementHeight + uiElementPadding > element.y
          ) {
            overlappingElements.push(element);
          }
        }
        
        // 각 요소가 최대 2개까지만 겹치도록 확인
        let isValidPosition = true;
        
        for (const element of overlappingElements) {
          // 현재 요소가 이미 다른 요소와 겹치는 횟수 확인
          let overlapCount = 0;
          
          for (const otherElement of placedElements) {
            if (element === otherElement) continue;
            
            if (
              element.x < otherElement.x + uiElementWidth + uiElementPadding &&
              element.x + uiElementWidth + uiElementPadding > otherElement.x &&
              element.y < otherElement.y + uiElementHeight + uiElementPadding &&
              element.y + uiElementHeight + uiElementPadding > otherElement.y
            ) {
              overlapCount++;
            }
          }
          
          // 이미 1개와 겹치고 있는 요소라면, 더 이상 겹칠 수 없음
          if (overlapCount >= 1) {
            isValidPosition = false;
            break;
          }
        }
        
        // 유효한 위치라면 반환
        if (isValidPosition) {
          return { x, y };
        }
      }
      
      // 최대 시도 횟수를 초과했을 경우, 화면 가장자리에 배치
      console.warn('최대 시도 횟수를 초과했습니다. 가장자리에 배치합니다.');
      return {
        x: Math.random() * (window.innerWidth - uiElementWidth - padding * 2) + padding,
        y: padding
      };
    };

    // UI 요소 초기화
    const elements = [];
    
    // 색상 배열
    const colors = [
      '#FFD6E0', '#FFEFCF', '#D4F0F0', '#E2F0CB',
      '#C9E4DE', '#FAEDCB', '#C6DEF1', '#F2C6DE',
      '#DBCDF0', '#F0D9DA', '#C7CEEA', '#E2F0CB'
    ];
    
    // 12개의 요소 생성
    for (let i = 1; i <= 12; i++) {
      const position = getRandomPosition();
      // 배치된 요소 위치 저장
      placedElements.push(position);
      
      elements.push({
        id: i,
        content: `드래그 가능한 UI ${i}`,
        color: colors[i - 1],
        position: position,
      });
    }

    setUiElements(elements);
  }, []);

  // 중앙 이미지 로드 완료 시 실제 크기 업데이트
  const handleImageLoad = (e) => {
    setCenterImageSize({
      width: e.target.offsetWidth,
      height: e.target.offsetHeight
    });
  };

  // 요소 위치 업데이트 핸들러
  const handlePositionChange = (id, newPosition) => {
    setUiElements(prev => prev.map(element => 
      element.id === id 
        ? { ...element, position: newPosition }
        : element
    ));
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#F7F6F3',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 중앙 이미지 */}
        <Box
          component="img"
          src={imgCenter}
          alt="Center Image"
          onLoad={handleImageLoad}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: 'auto',
            height: 'auto',
          }}
        />
        
        {/* 드래그 가능한 UI 요소들 */}
        {uiElements.map((element) => (
          <DraggableUI 
            key={element.id}
            id={element.id}
            initialPosition={element.position}
            allElements={uiElements}
            onPositionChange={handlePositionChange}
          >
            <Box
              sx={{
                padding: '20px',
                backgroundColor: element.color,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minWidth: '150px',
                textAlign: 'center',
              }}
            >
              {element.content}
            </Box>
          </DraggableUI>
        ))}
      </Box>
    </>
  );
};

export default MainLayout; 