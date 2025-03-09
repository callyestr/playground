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
      img1080x1350,
      imgThumbnail
    ];

    // 중앙 위치 설정 (모든 요소가 중앙에서 시작)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // 가장자리 위치 계산 함수
    const getEdgePosition = (index) => {
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
      
      // 요소들을 더 균등하게 분배하기 위해 인덱스 조정
      // 첫 4개는 각 가장자리에 하나씩, 나머지는 순환
      let regionIndex;
      if (index <= 4) {
        regionIndex = (index - 1) % 4;
      } else {
        // 5번째 요소부터는 랜덤하게 배치하되, 이전에 많이 배치된 영역은 피함
        regionIndex = Math.floor(Math.random() * 4);
      }
      
      return edgeRegions[regionIndex];
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
      
      // 약간의 랜덤성 추가 (위치 미세 조정)
      const jitter = 30;
      edgePosition.x += Math.random() * jitter * 2 - jitter;
      edgePosition.y += Math.random() * jitter * 2 - jitter;
      
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
          backgroundColor: '#F7F6F3',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
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