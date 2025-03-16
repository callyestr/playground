import { Box, CssBaseline } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import imgCenter from '../assets/img_center.svg';
import DraggableUI from './DraggableUI';

// SVG 파일들 가져오기
import imgThumbnail from '../assets/img_thumbnail.svg';
import imgPollaroid from '../assets/img_pollaroid.svg';
import imgTicket from '../assets/img_ticket.svg';
import imgVinyl from '../assets/img_vinyl.svg';
import imgBook1 from '../assets/img_book1.svg';
import imgBook2 from '../assets/img_book2.svg';
import imgNotes from '../assets/img_notes.svg';
import imgCircle from '../assets/img_circle.svg';
import img1080x608 from '../assets/img_1080x608.svg';
import img1080x1080 from '../assets/img_1080x1080.svg';
import img1080x1350 from '../assets/img_1080x1350.svg';
import reactSvg from '../assets/react.svg';

const MainLayout = () => {
  const [uiElements, setUiElements] = useState([]);
  const [centerImageSize, setCenterImageSize] = useState({ width: 500, height: 500 });
  const centerImageRef = useRef(null);

  // 빈티지 노트 배경 스타일
  const vintageNoteStyle = {
    backgroundColor: '#FFF9FA', // 약간 핑크빛이 도는 화이트톤
    backgroundImage: `
      linear-gradient(transparent 5px, transparent 5px),
      linear-gradient(#FFE5E9 0.1em, transparent 0.1em)
    `,
    backgroundSize: '100% 1.8em, 100% 1.8em, 1.8em 100%',
    backgroundPosition: '0 0, 0 0, 0 0',
    boxShadow: 'inset 0 0 100px rgba(255, 157, 170, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  };

  // 노트 질감 효과를 위한 오버레이 스타일
  const textureOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c4zIgLAAABvklEQVR4Ac3RBQEDMRAAwe1YMsX9W+1fZIFCKaUiJHRlsVqsdqRSq9UiVGWwI6VGs1WvdwYjMZZqNVrtTqfbG8RiMZknYrHYMPv9wXA0nkynk/F4NBwO+r1uJwzD9mw+ny8Wi/l8Np1OxuOgFQRBGHb6g+FoPJnOFsv1ZrPZrtebzXq1nM/G/V4QhGHYHwxHk+l8udps94fj6XS+XC/73SgKwzBsD0ejyXS+WK7W2/3xdL5cb3e7zXo5n4z7vTAIwvZgOBpPJrP5crXZ7g/H0/lyvd3tdpvVcjYZ93tBEITtwXA0nkxm8+Vqvdntj6fz5Xq73e3W6+ViOhn1e70g6IdhezAcjSfT2WK5Wm+2u/3xdL5cb3e7zXq1nE8n40EvCIIwbA+Go/FkOpsvlqv1ZrPd7Y+n8+V6s9ttN+vVcjGbjnvdMAjCsD0YDEfj6XQ2ny+Xy9V6s9ntD8fT+XK93mw3m/VqtZxPJ6NeNwyCsN3r9QfD4Wg8mc7m88Vyudpst7v94Xg6ny/X681ms1mvVsvFfDYZ9bphEIZh2O50e/3BYDgajSfT6Ww2ny+Xy9V6s9lud7v9fr/bbNarxXw2GQ97YRiGUdTpdLvdbq/X6/d6vbDbDcMwiqIoiqIoiqK/P0jZR8bHsNxxAAAAAElFTkSuQmCC")',
    opacity: 0.30,
    pointerEvents: 'none',
  };

  // 구겨진 종이 질감 효과
  const crumpledPaperStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='800' height='800' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
    opacity: 0.7,
    pointerEvents: 'none',
    mixBlendMode: 'multiply',
  };

  // 노트 가장자리 효과
  const noteEdgeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: 'inset 0 0 80px rgba(168, 79, 79, 0.14)',
    pointerEvents: 'none',
  };

  // 종이 주름 효과
  const paperCreaseStyle = {
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
  };

  useEffect(() => {
    // 중앙 이미지 크기 계산 (예상치로 시작)
    const centerWidth = 500;
    const centerHeight = 500;
    setCenterImageSize({ width: centerWidth, height: centerHeight });

    // UI 요소의 크기 (대략적인 값)
    const uiElementWidth = 250;
    const uiElementHeight = 300;
    const uiElementPadding = 20; // 요소 간 최소 간격

    // 이미 배치된 요소들의 위치와 겹침 카운트를 저장할 배열
    const placedElements = [];
    // 위치별 겹침 카운트를 저장할 맵
    const overlapCountMap = new Map();

    // SVG 파일 배열
    const svgFiles = [
      imgThumbnail,
      imgPollaroid,
      imgTicket,
      imgVinyl,
      imgBook1,
      imgBook2,
      imgNotes,
      imgCircle,
      img1080x608,
      img1080x1080,
      img1080x1350
    ];

    // 중앙 위치 설정 (모든 요소가 중앙에서 시작)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // 가장자리 위치 계산 함수
    const getEdgePosition = (index) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // 중앙 좌표
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
      
      // 중앙 기준 1000x1000px 영역 (제외 영역)
      const excludeAreaSize = 1000;
      const excludeLeft = centerX - excludeAreaSize / 2;
      const excludeRight = centerX + excludeAreaSize / 2;
      const excludeTop = centerY - excludeAreaSize / 2;
      const excludeBottom = centerY + excludeAreaSize / 2;
      
      // 화면 가장자리 패딩
      const padding = 80;
      
      // 배치 영역 정의 (화면을 8개 구역으로 나눔)
      const regions = [
        // 좌상단 (중앙 영역 밖)
        { 
          x: Math.random() * (excludeLeft - padding - uiElementWidth) + padding, 
          y: Math.random() * (excludeTop - padding - uiElementHeight) + padding 
        },
        // 상단 중앙 (중앙 영역 밖)
        { 
          x: Math.random() * (excludeRight - excludeLeft) + excludeLeft, 
          y: Math.random() * (excludeTop - padding - uiElementHeight) + padding 
        },
        // 우상단 (중앙 영역 밖)
        { 
          x: Math.random() * (screenWidth - excludeRight - padding - uiElementWidth) + excludeRight, 
          y: Math.random() * (excludeTop - padding - uiElementHeight) + padding 
        },
        // 좌측 중앙 (중앙 영역 밖)
        { 
          x: Math.random() * (excludeLeft - padding - uiElementWidth) + padding, 
          y: Math.random() * (excludeBottom - excludeTop) + excludeTop 
        },
        // 우측 중앙 (중앙 영역 밖)
        { 
          x: Math.random() * (screenWidth - excludeRight - padding - uiElementWidth) + excludeRight, 
          y: Math.random() * (excludeBottom - excludeTop) + excludeTop 
        },
        // 좌하단 (중앙 영역 밖)
        { 
          x: Math.random() * (excludeLeft - padding - uiElementWidth) + padding, 
          y: Math.random() * (screenHeight - excludeBottom - padding - uiElementHeight) + excludeBottom 
        },
        // 하단 중앙 (중앙 영역 밖)
        { 
          x: Math.random() * (excludeRight - excludeLeft) + excludeLeft, 
          y: Math.random() * (screenHeight - excludeBottom - padding - uiElementHeight) + excludeBottom 
        },
        // 우하단 (중앙 영역 밖)
        { 
          x: Math.random() * (screenWidth - excludeRight - padding - uiElementWidth) + excludeRight, 
          y: Math.random() * (screenHeight - excludeBottom - padding - uiElementHeight) + excludeBottom 
        }
      ];
      
      // 화면 크기가 작을 경우 일부 영역이 유효하지 않을 수 있음
      // 유효한 영역만 필터링
      const validRegions = regions.filter(region => {
        return (
          region.x >= padding && 
          region.y >= padding && 
          region.x + uiElementWidth <= screenWidth - padding && 
          region.y + uiElementHeight <= screenHeight - padding
        );
      });
      
      // 유효한 영역이 없으면 화면 가장자리에 배치
      if (validRegions.length === 0) {
        return {
          x: padding,
          y: padding
        };
      }
      
      // 요소들을 더 균등하게 분배하기 위해 인덱스 조정
      let regionIndex = index % validRegions.length;
      
      // 위치 선택
      let position = validRegions[regionIndex];
      
      // 약간의 랜덤성 추가 (위치 미세 조정)
      const jitter = 30;
      position.x += Math.random() * jitter * 2 - jitter;
      position.y += Math.random() * jitter * 2 - jitter;
      
      // 최종 위치가 중앙 제외 영역에 들어가지 않는지 확인
      const isCenterArea = (
        position.x + uiElementWidth > excludeLeft &&
        position.x < excludeRight &&
        position.y + uiElementHeight > excludeTop &&
        position.y < excludeBottom
      );
      
      // 중앙 영역에 들어가면 다시 계산
      if (isCenterArea) {
        // 가장 멀리 있는 영역 선택
        const cornerRegions = [0, 2, 5, 7]; // 좌상단, 우상단, 좌하단, 우하단 인덱스
        const cornerIndex = cornerRegions[Math.floor(Math.random() * cornerRegions.length)];
        position = validRegions[cornerIndex % validRegions.length];
        
        // 화면 경계 체크 및 조정
        if (position.x < padding) position.x = padding;
        if (position.y < padding) position.y = padding;
        if (position.x + uiElementWidth > screenWidth - padding) {
          position.x = screenWidth - uiElementWidth - padding;
        }
        if (position.y + uiElementHeight > screenHeight - padding) {
          position.y = screenHeight - uiElementHeight - padding;
        }
      }
      
      return position;
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
      // 가장자리에서 시작
      const edgePosition = getEdgePosition(i);
      
      elements.push({
        id: i,
        content: `드래그 가능한 UI ${i}`,
        color: colors[i - 1],
        position: edgePosition,
        svgPath: svgFiles[i - 1], // 각 요소에 다른 SVG 파일 할당
        initialRotation: Math.floor(Math.random() * 40) - 20 // 초기 회전 각도 (-20도 ~ 20도)
      });
    }

    setUiElements(elements);
  }, []);

  // 중앙 이미지 로드 완료 시 실제 크기 업데이트
  const handleImageLoad = (e) => {
    const width = e.target.offsetWidth;
    const height = e.target.offsetHeight;
    setCenterImageSize({
      width: width,
      height: height
    });
    
    // 중앙 이미지 위치 정보 업데이트
    if (centerImageRef.current) {
      const rect = centerImageRef.current.getBoundingClientRect();
      setCenterImageSize(prev => ({
        ...prev,
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        centerX: rect.left + width / 2,
        centerY: rect.top + height / 2
      }));
    }
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
          ...vintageNoteStyle,
        }}
      >
        {/* 노트 질감 오버레이 */}
        <Box sx={textureOverlayStyle} />
        
        {/* 구겨진 종이 질감 효과 */}
        <Box sx={crumpledPaperStyle} />
        
        {/* 종이 주름 효과 */}
        <Box sx={paperCreaseStyle} />
        
        {/* 노트 가장자리 효과 */}
        <Box sx={noteEdgeStyle} />
        
        {/* 중앙 이미지 */}
        <Box
          ref={centerImageRef}
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
            filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))',
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
            svgPath={element.svgPath}
            centerImageSize={centerImageSize}
            initialRotation={element.initialRotation}
          />
        ))}
      </Box>
    </>
  );
};

export default MainLayout; 